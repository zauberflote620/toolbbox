

## Process: 

1. see .workflows/parse

2. **Parse body text for:** customer name, GL code, product, quantity 

3. **Lookup cost** in Airtable Locator base (appGGNMyfoXzQJtP5, products table) 

4. **Read Excel template** from 
 - .workflows/quotes/[template][YY][MM][DD]_Department-Transfer_{First initial}{Last name of requestor}.xlsx

1. **copy template into new copy** 
2. Fill in data with parsed corresponding content 
3. **Save as:** [YY][MM][DD]_Department-Transfer_{First initial of requestor}{Last name of requestor}.xlsx

4. **Generate email reply** to quote: 
“””
Hi, 

Please see below for the cost of your request: 

[COPY exactly contents from Excel : 
columns a-g, rows 1-[2 rows after last not empty row]]

All best,

“””
## Trigger: "process quote" or "run quote” 