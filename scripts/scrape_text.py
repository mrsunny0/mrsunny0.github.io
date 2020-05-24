#%%
import requests
from bs4 import BeautifulSoup as bs
import re
import sys
from tkinter import Tk
from tkinter.filedialog import askdirectory, asksaveasfilename

#%%
root = Tk()
root.withdraw()
args = sys.argv
try:
    page_name = args[1]
except IndexError:
    print("please provide a wiki page name")
    sys.exit()

#%%
params = {
    "action" : "parse",
    "format" : "json",
    "page" : page_name,
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

#%% Save
pattern = r'\[.*?\]'
text_clean = re.sub(pattern, "", text)

filename = asksaveasfilename()
with open(filename, "w") as file:
    file.write(text_clean)

print("...saved")
