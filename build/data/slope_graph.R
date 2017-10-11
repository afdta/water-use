library(readxl)
library(dplyr)
library(tidyr)
library(jsonlite)
library(ggplot2)

dat <- read_xlsx("/home/alec/Projects/Brookings/water/build/data/final/FINAL_Metro_FullBreakdown_85_10_Alec.xlsx", sheet="1985")

# Public supply +
# Domestic self-supply + Industrial self-supply + 
# Irrigation + Livestock + Aquaculture + 
# Mining + Thermoelectric
# = Total withdrawals
dat2 <- dat %>% mutate(tot=`PS-Wtotl`+`DO-WFrTo`+`IN-Wtotl`+`IR-WFrTo`+`LI-WFrTo`+`AQ-WTotl`+`MI-Wtotl`+`PT-Wtotl`,
                       geo_type = TOP_METRO + (2*SMALL_METRO) + (3*MICRO_AREA) + (4*RURAL) )

dat2$metro <- ifelse(dat2$geo_type <= 2, 1, 0)

#checks
table(dat2$TOP_METRO, dat2$geo_type)
table(dat2$SMALL_METRO, dat2$geo_type)
table(dat2$MICRO_AREA, dat2$geo_type)
table(dat2$RURAL, dat2$geo_type)
table(dat2$geo_type, dat2$metro)

which(is.na(dat2$tot)) 
range(dat2$tot-dat2$`TO-WTotl`)

dat3 <- dat2 %>% select(stcofips, fips=STATEFIPS, state, cbsa, geo_type, metro, pop=`TP-TotPop`, tot, public_supply = `PS-Wtotl`, dom_self_supply = `DO-WFrTo`, ind_self_supply=`IN-Wtotl`, 
                        irrigation=`IR-WFrTo`, livestock=`LI-WFrTo`, aquaculture=`AQ-WTotl`, mining=`MI-Wtotl`, thermoelectric=`PT-Wtotl`)

dat3$other = dat3$dom_self_supply + dat3$livestock + dat3$aquaculture + dat3$mining

tots0 <- dat3 %>% group_by(metro) %>% summarise_at(c("tot","thermoelectric","public_supply","ind_self_supply","irrigation","other"), sum) %>%
  gather(category, withdrawals, tot:other)

tots1 <- dat3 %>% summarise_at(c("tot","thermoelectric","public_supply","ind_self_supply","irrigation","other"), sum) %>%
  gather(category, withdrawals, tot:other)
tots1$metro = 2

totsa_85 <- bind_rows(tots1, tots0) %>% select(category, metro, use1985=withdrawals)

rm(dat, dat2, dat3, tots0, tots1)


#run same code for 2010 -- 
dat <- read_xlsx("/home/alec/Projects/Brookings/water/build/data/final/FINAL_Metro_FullBreakdown_85_10_Alec.xlsx", sheet="2010_Metro_FullBreakdown")

# Public supply +
# Domestic self-supply + Industrial self-supply + 
# Irrigation + Livestock + Aquaculture + 
# Mining + Thermoelectric
# = Total withdrawals
dat2 <- dat %>% mutate(tot=`PS-Wtotl`+`DO-WFrTo`+`IN-Wtotl`+`IR-WFrTo`+`LI-WFrTo`+`AQ-WTotl`+`MI-Wtotl`+`PT-Wtotl`,
                       geo_type = TOP_METRO + (2*SMALL_METRO) + (3*MICRO_AREA) + (4*RURAL) )

dat2$metro <- ifelse(dat2$geo_type <= 2, 1, 0)

#checks
table(dat2$TOP_METRO, dat2$geo_type)
table(dat2$SMALL_METRO, dat2$geo_type)
table(dat2$MICRO_AREA, dat2$geo_type)
table(dat2$RURAL, dat2$geo_type)
table(dat2$geo_type, dat2$metro)

which(is.na(dat2$tot)) 
range(dat2$tot-dat2$`TO-WTotl`)

dat3 <- dat2 %>% select(stcofips, fips=STATEFIPS, state, cbsa, geo_type, metro, pop=`TP-TotPop`, tot, public_supply = `PS-Wtotl`, dom_self_supply = `DO-WFrTo`, ind_self_supply=`IN-Wtotl`, 
                        irrigation=`IR-WFrTo`, livestock=`LI-WFrTo`, aquaculture=`AQ-WTotl`, mining=`MI-Wtotl`, thermoelectric=`PT-Wtotl`)

dat3$other = dat3$dom_self_supply + dat3$livestock + dat3$aquaculture + dat3$mining

tots0 <- dat3 %>% group_by(metro) %>% summarise_at(c("tot","thermoelectric","public_supply","ind_self_supply","irrigation","other"), sum) %>%
  gather(category, withdrawals, tot:other)

tots1 <- dat3 %>% summarise_at(c("tot","thermoelectric","public_supply","ind_self_supply","irrigation","other"), sum) %>%
  gather(category, withdrawals, tot:other)
tots1$metro = 2

totsa_10 <- bind_rows(tots1, tots0) %>% select(category, metro, use2010=withdrawals)

rm(dat, dat2, dat3, tots0, tots1)

tots <- merge(totsa_85, totsa_10, by=c("category","metro")) %>% mutate(indx1985 = (100*use1985/use1985), indx2010 = (100*use2010/use1985)) %>%
  gather(var, withdrawals, indx1985, indx2010) %>% separate(var, c("var","year"), 4, convert=TRUE) %>% filter(category != "other")

tots$met <- factor(tots$metro, levels=0:2, labels=c("Non-metropolitan", "Metropolitan", "U.S. Total"))
tots$cat <- factor(tots$category, levels=c("tot","thermoelectric","irrigation","public_supply","ind_self_supply","other"),
                   labels=c("Total","Thermoelectric power", "Irrigation", "Public supply", "Industrial", "Other"))

ggplot(tots) + geom_line(aes(x=year, y=withdrawals, color=met, group=met)) + 
  geom_text(aes(x=year, y=withdrawals, label=ifelse(year==1985, "", paste0(round(withdrawals-100,1),"%")) )) +
  facet_wrap(~cat, nrow=1) + scale_x_continuous(breaks=c(1985, 2010))