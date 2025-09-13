import requests
from bs4 import BeautifulSoup

BASE_URL = "https://classes.uwaterloo.ca/cgi-bin/cgiwrap/infocour/salook.pl"

def scrape_sections(level="grad", term="1259", subject="ECE", number=""):
    params = {
        "level": level,
        "sess": term,
        "subject": subject,
        "cournum": number,
    }

    resp = requests.get(BASE_URL, params=params)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")
    table = soup.find("table")
    if not table:
        print("No table found on page.")
        return []

    sections = []
    rows = table.find_all("tr")
    i = 0
    while i < len(rows):
        row = rows[i]
        cols = row.find_all("td")
        
        # Skip header ("th" so len is 0) or empty rows
        if len(cols) < 4:
            i += 1
            continue
        
        # Course description row
        course_subject = cols[0].get_text(strip=True)
        course_number = cols[1].get_text(strip=True)
        course_title = cols[3].get_text(strip=True)
        course_code = f"{course_subject}{course_number}"  # combine subject+number
        
        # Next row has the subtable with enrollment info
        i += 1
        if i >= len(rows):
            break
        sub_row = rows[i]
        sub_td = sub_row.find("td", colspan=True)
        if sub_td:
            sub_table = sub_td.find("table")
            if sub_table:
                sub_rows = sub_table.find_all("tr")
                if len(sub_rows) >= 2:
                    data_cols = sub_rows[1].find_all("td")
                    enrolled = int(data_cols[7].get_text(strip=True))
                    capacity = int(data_cols[6].get_text(strip=True))
                    section = {
                        "course": course_code,
                        "title": course_title,
                        "section": data_cols[1].get_text(strip=True),  # Comp Sec
                        "enrolled": enrolled,
                        "capacity": capacity,
                        "availableSeats": capacity - enrolled
                    }
                    sections.append(section)
        i += 1  # move to next course block

    return sections

if __name__ == "__main__":
    data = scrape_sections(term="1259", subject="ECE")
    for sec in data:
        print(sec)
