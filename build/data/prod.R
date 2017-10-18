library(readxl)
library(dplyr)
library(tidyr)
library(jsonlite)
library(ggplot2)

#exploratory data analysis for water
dat <- read_xlsx("/home/alec/Projects/Brookings/water/build/data/final/FINAL_Metro_FullBreakdown_85_10_Alec.xlsx", sheet="2010_Metro_FullBreakdown")
dat05 <- read_xlsx("/home/alec/Projects/Brookings/water/build/data/final/FINAL_Metro_FullBreakdown_85_10_Alec.xlsx", sheet="2005")

# Public supply +
# Domestic self-supply + Industrial self-supply + 
# Irrigation + Livestock + Aquaculture + 
# Mining + Thermoelectric
# = Total withdrawals
dat2_10 <- dat %>% mutate(tot=`PS-Wtotl`+`DO-WFrTo`+`IN-Wtotl`+`IR-WFrTo`+`LI-WFrTo`+`AQ-WTotl`+`MI-Wtotl`+`PT-Wtotl`,
                       geo_type = TOP_METRO + (2*SMALL_METRO) + (3*MICRO_AREA) + (4*RURAL) )

dat2_05 <- dat05 %>% mutate(tot05=`PS-Wtotl`+`DO-WFrTo`+`IN-Wtotl`+`IR-WFrTo`+`LI-WFrTo`+`AQ-WTotl`+`MI-Wtotl`+`PT-Wtotl`) %>% select(stcofips, tot05)

dat2 <- left_join(dat2_10, dat2_05)

dat2$metro <- factor(ifelse(dat2$geo_type <= 2, 1, 0), levels=c(0,1))

missings <- filter(dat2, is.na(tot05)) #5 counties in AK must be new since 05 -- nonmetro
filter(dat2, is.na(tot))

#checks
table(dat2$TOP_METRO, dat2$geo_type)
table(dat2$SMALL_METRO, dat2$geo_type)
table(dat2$MICRO_AREA, dat2$geo_type)
table(dat2$RURAL, dat2$geo_type)
table(dat2$geo_type, dat2$metro)

which(is.na(dat2$tot)) 
range(dat2$tot-dat2$`TO-WTotl`)

dat3 <- dat2 %>% select(stcofips, fips=STATEFIPS, state, cbsa, geo_type, metro, pop=`TP-TotPop`, tot, tot05, public_supply = `PS-Wtotl`, dom_self_supply = `DO-WFrTo`, ind_self_supply=`IN-Wtotl`, 
                        irrigation=`IR-WFrTo`, livestock=`LI-WFrTo`, aquaculture=`AQ-WTotl`, mining=`MI-Wtotl`, thermoelectric=`PT-Wtotl`)

dat3$other = dat3$dom_self_supply + dat3$livestock + dat3$aquaculture + dat3$mining

sumna <- function(v){return(sum(v, na.rm=TRUE))}
us0 <- summarise_at(dat3, vars(pop:thermoelectric), sumna) %>% mutate(ch0510 = (tot/tot05)-1)
us0$state <- "US"
us0$fips <- "US"
us1 <- group_by(dat3, metro) %>% summarise_at(vars(pop:thermoelectric), sumna) %>% mutate(ch0510 = (tot/tot05)-1)
us1$state <- "US"
us1$fips <- "US"

st0 <- group_by(dat3, fips, state) %>% summarise_at(vars(pop:thermoelectric), sumna) %>% mutate(ch0510 = (tot/tot05)-1)
st1 <- group_by(dat3, fips, state, metro) %>% summarise_at(vars(pop:thermoelectric), sumna) %>% mutate(ch0510 = (tot/tot05)-1)

metros <- dat3 %>% filter(geo_type==1) %>% group_by(cbsa) %>% summarise_at(vars(pop:thermoelectric), sum) %>% mutate(ch0510 = (tot/tot05)-1)

fin <- list()
fin$state <- list()
fin$state$total <- bind_rows(st0, us0)
fin$state$metro <- bind_rows(filter(st1, metro==1), filter(us1, metro==1))
fin$state$nonmetro <- bind_rows(filter(st1, metro==0), filter(us1, metro==0))
fin$metro <- metros

json <- toJSON(fin, digits=5, na="null", factor="string")

writeLines(json, "/home/alec/Projects/Brookings/water/assets/water.json")

