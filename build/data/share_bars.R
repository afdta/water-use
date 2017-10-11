library(readxl)
library(dplyr)
library(tidyr)
library(jsonlite)
library(ggplot2)

#exploratory data analysis for water
dat <- read_xlsx("/home/alec/Projects/Brookings/water/build/data/final/FINAL_Metro_FullBreakdown_85_10_Alec.xlsx", sheet="2010_Metro_FullBreakdown")

# Public supply +
# Domestic self-supply + Industrial self-supply + 
# Irrigation + Livestock + Aquaculture + 
# Mining + Thermoelectric
# = Total withdrawals
dat2 <- dat %>% mutate(tot=`PS-Wtotl`+`DO-WFrTo`+`IN-Wtotl`+`IR-WFrTo`+`LI-WFrTo`+`AQ-WTotl`+`MI-Wtotl`+`PT-Wtotl`,
                       geo_type = TOP_METRO + (2*SMALL_METRO) + (3*MICRO_AREA) + (4*RURAL) )

dat2$metro <- factor(ifelse(dat2$geo_type <= 2, 1, 0), levels=c(0,1))

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

stshares <- dat3 %>% group_by(metro) %>% summarise_at(c("tot","thermoelectric","public_supply","ind_self_supply","irrigation","other"), sum) %>%
  mutate_at(c("tot","thermoelectric","public_supply","ind_self_supply","irrigation","other"), function(v){return(v/sum(v))}) %>% 
  gather(category, withdrawals, thermoelectric:other)
stshares$label <- paste0(round(stshares$withdrawals*100,1), "%")
stshares$cat <- factor(stshares$category, 
                       levels=c("thermoelectric",  "irrigation", "public_supply", "ind_self_supply", "other"),
                       labels=c("Thermoelectric power",  "Irrigation", "Public supply", "Industrial", "Other")
)

stshares1 <- dat3 %>% summarise_at(c("thermoelectric","public_supply","ind_self_supply","irrigation","other"), sum) %>%
  gather(category, withdrawals, thermoelectric:other)
stshares1$share <- stshares1$withdrawals/sum(stshares1$withdrawals)

stshares$label <- paste0(round(stshares$withdrawals*100,1), "%")
stshares$cat <- factor(stshares$category, 
                       levels=c("thermoelectric",  "irrigation", "public_supply", "ind_self_supply", "other"),
                       labels=c("Thermoelectric power",  "Irrigation", "Public supply", "Industrial", "Other")
)

ggplot(stshares) + geom_col(aes(x=cat, y=withdrawals, fill=metro), position="stack") +
  geom_text(aes(label=label, x=cat, y=withdrawals, group=metro), position=position_stack(vjust=0.5))