library(readxl)
library(dplyr)

#exploratory data analysis for water
dat <- read_xlsx("/home/alec/Projects/Brookings/water/build/data/final/FINAL_Metro_FullBreakdown_85_10_Alec.xlsx", sheet="2010_Metro_FullBreakdown")

#need to figure out defs
dat2 <- dat %>% mutate(tot=`PS-Wtotl`+`DO-WFrTo`+`DO-PSDel`+`IN-Wtotl`,`IR-WFrTo`,`LI-WFrTo`,`AQ-WTotl`,`MI-Wtotl`,`PT-Wtotl`)
