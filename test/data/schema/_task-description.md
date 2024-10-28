# Guideline for defining event profile rules

## Subject Matter Expert (SME)

1. Write a markdown file for an EPCIS event profile. See
[Ralph's & Bhavesh's First Sample Profile](ralph-bhavesh-sample-profile.md).
2. Describe, in plain English, the rules making up the EPCIS event profile.
3. Send the file to your tandem developer once you are done.

## Developer

1. Create a new branch (e.g. name it according to the EPCIS event profile's name)
2. In the /schema folder, add two files (please ensure that both files have an idential name, except the file extension):
   - The markdown document of your SME tandem.
   - A JSON file with the corresponding JSON schema.
3. Develop the JSON schema (thereby, feel free to make use of our [Google Doc](https://docs.google.com/document/d/1cDvtT_bTEvymv0felIyRCocZTJVDaJetUcqfgdXM-bM/edit?tab=t.0) which already contains a number of usefule JSON schema snippets).
4. Once you are ready, issue a Pull Request.
