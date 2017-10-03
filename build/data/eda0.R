library(readxl)
library(dplyr)
library(tidyr)

#exploratory data analysis for water
dat <- read_xlsx("/home/alec/Projects/Brookings/water/build/data/final/FINAL_Metro_FullBreakdown_85_10_Alec.xlsx", sheet="2010_Metro_FullBreakdown")

# Public supply +
# Domestic self-supply + Industrial self-supply + 
# Irrigation + Livestock + Aquaculture + 
# Mining + Thermoelectric
# = Total withdrawals
dat2 <- dat %>% mutate(tot=`PS-Wtotl`+`DO-WFrTo`+`IN-Wtotl`+`IR-WFrTo`+`LI-WFrTo`+`AQ-WTotl`+`MI-Wtotl`+`PT-Wtotl`,
                       geo_type = TOP_METRO + (2*SMALL_METRO) + (3*MICRO_AREA) + (4*RURAL) )

table(dat2$TOP_METRO, dat2$geo_type)
table(dat2$SMALL_METRO, dat2$geo_type)
table(dat2$MICRO_AREA, dat2$geo_type)
table(dat2$RURAL, dat2$geo_type)

which(is.na(dat2$tot)) 
range(dat2$tot-dat2$`TO-WTotl`)

range(dat2$TO_Percapita - (dat2$`TO-WTotl`/dat2$`TP-TotPop`))

dat3 <- dat2 %>% select(stcofips, st=STATEFIPS, state, cbsa, geo_type, tot, public_supply = `PS-Wtotl`, dom_self_supply = `DO-WFrTo`, ind_self_supply=`IN-Wtotl`, 
                        irrigation=`IR-WFrTo`, livestock=`LI-WFrTo`, aquaculture=`AQ-WTotl`, mining=`MI-Wtotl`, thermoelectric=`PT-Wtotl`)

dat4 <- dat3 %>% gather(category, withdrawals, public_supply:thermoelectric) %>% 
                 mutate(category2 = ifelse(category %in% c("dom_self_supply", "livestock", "aquaculture", "mining"), "other", category)) %>%
                 mutate(metro = ifelse(geo_type %in% 1:2, 1, 0))

table(dat4$category, dat4$category2)
table(dat4$geo_type, dat4$metro)

summ1 <- group_by(dat4, metro, category2) %>% summarise(withdrawals = sum(withdrawals)) %>% spread(category2, withdrawals) %>% 
  mutate(total=ind_self_supply+irrigation+other+public_supply+thermoelectric) %>% ungroup() %>%
  mutate_at(vars(ind_self_supply:total), function(v){return(v/sum(v))})

summ2 <- group_by(dat4, st, state, metro, category2) %>% summarise(withdrawals = sum(withdrawals)) %>% spread(category2, withdrawals) %>% 
  mutate(total=ind_self_supply+irrigation+other+public_supply+thermoelectric) %>% ungroup() %>%
  mutate_at(vars(ind_self_supply:total), function(v){return(v/sum(v))})

summ3 <- group_by(dat4, st, state, category2) %>% summarise(withdrawals = sum(withdrawals)) %>% spread(category2, withdrawals) %>% 
  mutate(total=ind_self_supply+irrigation+other+public_supply+thermoelectric) %>% ungroup() %>%
  mutate_at(vars(ind_self_supply:total), function(v){return(v/sum(v))})
summ3$metro <- 3

source("/home/alec/Projects/RMaps/build/geo/geo_data.R")

draw_map <- function(df=bind_rows(summ2, summ3), category){
  metshares <- merge(geo$states, df, by.x="id", by.y="st")
  metshares <- metshares[order(metshares$order), ]
  map <- ggplot(metshares) +
    geom_polygon(aes_string(x="long", y="lat", group="group", fill=category), colour="#ffffff", size=0.25) + 
    coord_fixed() + facet_wrap("metro", nrow=1) + scale_fill_gradient(low="#dddddd", high="#000000") +
    theme(text=element_text(family="Liberation Sans", color="#111111", size=12, hjust=0.5),
          axis.line=element_blank(),
          plot.title = element_text(size=24, family="Liberation Serif", margin=margin(t=12, b=0, unit="pt")),
          plot.margin = margin(t=12,b=-12,unit="pt"),
          plot.subtitle = element_text(color="#111111", size=18, hjust=0.25),
          axis.text.x=element_blank(),
          axis.text.y=element_blank(),
          axis.ticks=element_blank(),
          axis.title.x=element_blank(),
          axis.title.y=element_blank(),
          legend.position=c(1.025,.27),
          legend.key = element_rect(size=5, colour="#ffffff"),
          legend.key.size = unit(1.25, "lines"),
          legend.direction="vertical",
          legend.justification=1,
          legend.text = element_text(size=11),
          legend.title = element_text(size=13),
          legend.box.spacing=unit(1,"pt"), 
          legend.box.margin=margin(l=3, unit="pt"),
          panel.background=element_blank(),
          panel.border=element_blank(),
          panel.grid.major=element_blank(),
          panel.grid.minor=element_blank(),
          plot.background=element_blank())
  return(map)
}

draw_map(category="total")
draw_map(category="irrigation")
draw_map(category="thermoelectric")
draw_map(category="ind_self_supply")
draw_map(category="public_supply")
draw_map(category="other")

#US/State sums for different cuts

#domestic self supply vs -- what is public supply vs these others? are the others self supply?
barplot(unlist(summarise_at(dat,  vars(`DO-WFrTo`, `IN-Wtotl`, `PS-Wtotl`, `DO-PSDel`, `IR-WFrTo`, `LI-WFrTo`, `AQ-WTotl`, `MI-Wtotl`, `PT-Wtotl`), sum)))

