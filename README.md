# Prototyping a map interface for Hindutva Watch

- The HW database is a collection of news articles, tweets, and other sources of information about the activities of Hindutva groups in India.
- I believe it is pertinent to develop a easier way to understand relationships between these groups and their activities.

## Prototype
- The database is scraped from the Hindutva Watch website and stored in a CSV
- ```SpaCy``` is used to extract named locations (NER) from the text
- The lowest denominator location is selected and geocoded
- It is then mapped using ```Folium```