# xercleaner
P6 XER cleaner

This project will take an XER and 'clean' it by pasing the text file and removing or editing data.

Everything is done client side (in your browser) so there are no data security concerns.  At the moment not even cookies are stored although the option to do so may come with increased functionality.

P6 XERs can contain a lot of junk data that is of no value and can clutter your database, potentially slowing performance.  These data are in tables called POBS and RISKTYPE.  Whilst more recent versions of P6 don't create these data in XERs, they are still present in exports from older versions of P6.

If you are importing a contractor or supplier's XER to your database you don't need to import all of the data in the XER.  Often you'll just want the key dates.  I have safely deleted the following tables from XERS with no loss of useful information.

`APPLYACTOPTIONS`, `DOCCATG`, `DOCUMENT`, `LOCATION`, `MEMOTYPE`, `NONWORK`, `PCATTYPE`, `PCATVAL`, `PHASE`, `PROJTHRS`, `PROJPCAT`, `PROJISSU`, `ROLERATE`, `ROLELIMIT`, `TASKDOC`, `TASKMEMO`, `TASKNOTE`, `WBSBUDG`, `WBSMEMO`, `WBSSTEP`

The option to delete these files or leave them is available.

You may want to delete or retain UDFs (User defined fields).  Again the option to do either is available.

Finally you may want to add a tag so you can easily identify who's XER you are looking at.  A great example is calendars.  One company's "Five day working" calendar might be Monday to Friday whilst another one might be Wednesday to Sunday. Add a tag to the XER and you can have "CO-1_Five day working" and "CO-2_Five day working" calendars.

The tags are limited to four characters to prevent problems with over-long data in XERs.

Import your file, set your options, run the cleaner and export it.  Hopefully a quick and simple process.

