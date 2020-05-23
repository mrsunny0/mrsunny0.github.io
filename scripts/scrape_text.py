#%%
import requests
from bs4 import BeautifulSoup as bs
import re
import sys
import Tkinter, tkFileDialog

#%%
args = sys.argv

#%%
params = {
    "action" : "parse",
    "format" : "json",
    "page" : "DevOps",
    # "titles" : "devops",
    # "prop" : "extracts",
    # "exinto" : True,
    # "explaintext" : True,
}
response = requests.get('https://en.wikipedia.org/w/api.php', params=params).json()

html = response["parse"]["text"]["*"]

#%%
soup = bs(html)
text = soup.get_text()
print(text)

#%% Save
pattern = r'\[.*?\]'
text_clean = re.sub(pattern, "", text)

output_path = tkFileDialog.asksaveasfile()
