
var globalSaveArray = [];

function DebugGlobalSaveArray() {
    var ii;
    for (ii=0; ii < globalSaveArray.length; ii++)
    {
        console.log(globalSaveArray[ii]);
        console.log("");
    }

    // Create element with <a> tag
    const link = document.createElement("a");
    const mytextarea = document.createElement("textarea");
    mytextarea.innerHTML = "UNIT, BOOKING-ID, INCOME, MGMT-FEE, TAT1, TAT2, GE1, GE2, SUBTOTAL, TAT-GROSS-INCOME, TAT, GET-GROSS-INCOME, GET\n";

    var unitstr = "";
    var TATGrossIncome;
    var TAT;
    var GETGrossIncome;
    var GET;
    for (ii=0; ii < globalSaveArray.length; ii++)
    {
        if (globalSaveArray[ii].a_type == "Unit")
            unitstr = globalSaveArray[ii].b_str;
        else if (globalSaveArray[ii].a_type == "Booking")
        {
            TATGrossIncome = Number(globalSaveArray[ii].d_customerbookingincome) +
                             Number(globalSaveArray[ii].f_TATtax1) +
                             Number(globalSaveArray[ii].g_TATtax2) +
                             Number(globalSaveArray[ii].h_GEtax1)  +
                             Number(globalSaveArray[ii].i_GEtax2);

            TAT = TATGrossIncome * 0.1025;

            GETGrossIncome = TATGrossIncome * (1.0978875 / 0.955);

            GET = GETGrossIncome - TAT - TATGrossIncome;

            mytextarea.innerHTML += unitstr + "," +
                                    globalSaveArray[ii].b_bookingid + "," +
                                    globalSaveArray[ii].d_customerbookingincome + "," +
                                    globalSaveArray[ii].e_mgmtfee + "," +
                                    globalSaveArray[ii].f_TATtax1 + "," +
                                    globalSaveArray[ii].g_TATtax2 + "," +
                                    globalSaveArray[ii].h_GEtax1 + "," +
                                    globalSaveArray[ii].i_GEtax2 + "," +
                                    globalSaveArray[ii].j_bookingsubtotal + "," +
                                    TATGrossIncome + "," +
                                    TAT + "," +
                                    GETGrossIncome + "," +
                                    GET + "\n";

        }
    }
    // Create a blog object with the file content which you want to add to the file
    const file = new Blob([mytextarea.innerHTML], { type: 'text/plain' });

    // Add file content in the object URL
    link.href = URL.createObjectURL(file);

    // Add file name
    link.download = "sample.csv";

    // Add click event to <a> tag to save file.
    link.click();
    URL.revokeObjectURL(link.href);
}//DebugGlobalSaveArray

function PrintTableUnit(mytabletag) {
    const tr_tags = mytabletag.getElementsByTagName("tr");
    const myobj = { a_type: "Unit", 
                     b_str:  tr_tags[0].getElementsByTagName("strong")[0].innerHTML.trim() };
    globalSaveArray.push(myobj);
}



function PrintTableSpecialSmallBooking(mytabletag)  {
    const tr_tags = mytabletag.getElementsByTagName("tr");
    var ii;
    
    var tempstr;

    var savebookingid;
    var savedatesandcustomer;
    var savecustomerbookingincome;
    var savemgmtfee;
    var savebookingsubtotal;
    for (ii=0; ii < tr_tags.length; ii++)
    {
        //var tempstr = ptags[pp].getElementsByTagName("span")[0].innerHTML;
        //some strings contain  &lt;u&gt;&lt;/u&gt;&lt;u&gt;&lt;/u&gt;
        //some strings contain  &amp;lt;=/span&amp;gt;

        //this replace did not work
        //var goodstr =
        //tempstr.replace("&lt;u&gt;&lt;/u&gt;&lt;u&gt;&lt;/u&gt;", " ");
        //var testincludesutags = tempstr.includes("<u>");
        //if (testincludesutags)
        //{
        //    tempstr = tempstr.replace("<u></u><u></u>", "");
        //    tempstr = tempstr.trim();
        //}
        //var testincludesequalendspan = tempstr.includes("<=/span>");
        //if (testincludesequalendspan)
        //{
        //    tempstr = tempstr.replace("<=/span>", "");
        //    tempstr = tempstr.trim();
        //}

        switch(ii)
        {
            case 0:  //Booking-ID and Customer and Customer dates
        	    tempstr = tr_tags[ii].getElementsByTagName("strong")[0].innerHTML;
        	    savebookingid = tempstr.trim();
                tempstr = tr_tags[ii].getElementsByTagName("strong")[1].innerHTML;
                savedatesandcustomer = tempstr.trim();
                break;
            
            case 1:  //customer booking income
            	tempstr = tr_tags[ii].getElementsByTagName("td")[3].innerHTML;
                savecustomerbookingincome = tempstr.replace("$", "").trim();
                break;
                
            case 2:  //management fee
                tempstr = tr_tags[ii].getElementsByTagName("td")[2].innerHTML;
                savemgmtfee = tempstr.replace("$", "").trim();
                break;
                
            case 3: //booking subtotal
            	tempstr = tr_tags[ii].getElementsByTagName("strong")[1].innerHTML;
                savebookingsubtotal = tempstr.replace("$", "").trim();
                break;
                
            default: console.log("ERROR: default in PrintTableSpecialSmallBooking!!!!!");
                break;
        }//switch
    }//for

    const myobj = { a_type: "Booking",
                     b_bookingid: savebookingid,
                     c_datesandcustomer: savedatesandcustomer,
                     d_customerbookingincome: savecustomerbookingincome,
                     e_mgmtfee: savemgmtfee,
                     f_TATtax1: 0,
                     g_TATtax2: 0,
                     h_GEtax1: 0,
                     i_GEtax2: 0,
                     j_bookingsubtotal: savebookingsubtotal };
    globalSaveArray.push(myobj);
}//PrintTableSpecialSmallBooking



function PrintTableBooking(mytabletag) {
    const tr_tags = mytabletag.getElementsByTagName("tr");
    var ii;
    
    var tempstr;

    var savebookingid;
    var savedatesandcustomer;
    var savecustomerbookingincome;
    var savemgmtfee;
    var saveTATtax1;
    var saveTATtax2;
    var saveGEtax1;
    var saveGEtax2;
    var savebookingsubtotal;
    for (ii=0; ii < tr_tags.length; ii++)
    {
        //var tempstr = ptags[pp].getElementsByTagName("span")[0].innerHTML;
        //some strings contain  &lt;u&gt;&lt;/u&gt;&lt;u&gt;&lt;/u&gt;
        //some strings contain  &amp;lt;=/span&amp;gt;

        //this replace did not work
        //var goodstr =
        //tempstr.replace("&lt;u&gt;&lt;/u&gt;&lt;u&gt;&lt;/u&gt;", " ");
        //var testincludesutags = tempstr.includes("<u>");
        //if (testincludesutags)
        //{
        //    tempstr = tempstr.replace("<u></u><u></u>", "");
        //    tempstr = tempstr.trim();
        //}
        //var testincludesequalendspan = tempstr.includes("<=/span>");
        //if (testincludesequalendspan)
        //{
        //    tempstr = tempstr.replace("<=/span>", "");
        //    tempstr = tempstr.trim();
        //}

        switch(ii)
        {
            case 0:  //Booking-ID and Customer and Customer dates
        	    tempstr = tr_tags[ii].getElementsByTagName("strong")[0].innerHTML;
        	    savebookingid = tempstr.trim();
                tempstr = tr_tags[ii].getElementsByTagName("strong")[1].innerHTML;
                savedatesandcustomer = tempstr.trim();
                break;
            
            case 1:  //customer booking income
            	tempstr = tr_tags[ii].getElementsByTagName("td")[3].innerHTML;
                savecustomerbookingincome = tempstr.replace("$", "").trim();
                break;
                
            case 2:  //management fee
                tempstr = tr_tags[ii].getElementsByTagName("td")[2].innerHTML;
                savemgmtfee = tempstr.replace("$", "").trim();
                break;
                
            case 3: //1st TAT Tax
            	tempstr = tr_tags[ii].getElementsByTagName("td")[3].innerHTML;
                saveTATtax1 = tempstr.replace("$", "").trim();
                break;
                
            case 4: //2nd TAT Tax
            	tempstr = tr_tags[ii].getElementsByTagName("td")[3].innerHTML; 
                saveTATtax2 = tempstr.replace("$", "").trim();
                break;
                
            case 5: //1st GET Tax
            	tempstr = tr_tags[ii].getElementsByTagName("td")[3].innerHTML;
            	saveGEtax1 = tempstr.replace("$", "").trim();
            	break;
            
            case 6: //2nd GET Tax
            	tempstr = tr_tags[ii].getElementsByTagName("td")[3].innerHTML;
            	saveGEtax2 = tempstr.replace("$", "").trim();
            	break;
                
            case 7: //booking subtotal
            	tempstr = tr_tags[ii].getElementsByTagName("strong")[1].innerHTML;
                savebookingsubtotal = tempstr.replace("$", "").trim();
                break;
                
            default: console.log("ERROR: default in PrintTableBooking!!!!!");
                break;
        }//switch
    }//for

    const myobj = { a_type: "Booking",
                     b_bookingid: savebookingid,
                     c_datesandcustomer: savedatesandcustomer,
                     d_customerbookingincome: savecustomerbookingincome,
                     e_mgmtfee: savemgmtfee,
                     f_TATtax1: saveTATtax1,
                     g_TATtax2: saveTATtax2,
                     h_GEtax1: saveGEtax1,
                     i_GEtax2: saveGEtax2,
                     j_bookingsubtotal: savebookingsubtotal };
    globalSaveArray.push(myobj);
}//PrintTableBooking

function PrintTableSubtotalAllBookingsForUnit(mytabletag) {
    var tempstr = mytabletag.getElementsByTagName("strong")[1].innerHTML;
    var savesubtotal = tempstr.trim();
    
    const myobj = { a_type: "UnitBookingsSubtotal",
    b_subtotal: savesubtotal  };
    globalSaveArray.push(myobj);
}//PrintTableSubtotalAllBookingsForUnit


function DebugTestTableTags(tabletags) {
    var tt=0;
    for (tt=0; tt < tabletags.length; tt++)
    {
        const trtags = tabletags[tt].getElementsByTagName("tr");
        console.log("tt=" + tt + " trtags.length=" + trtags.length);
    }
}

function main() {
    console.log("hello hello");
    console.log("chrome-->view entire message-->view page source");
    const bodytag = document.getElementsByTagName("body");
    if (bodytag.elements === undefined)
        console.log("bodytag.elements === undefined because elements are for form tags");

    var tabletags = bodytag[0].getElementsByTagName("table");

    //save as .html file
    //trigger off of tr tags
    //first trtags.length=1 is unit
    //followed by series of trtags.length=8 is booking
    //followed by trtags.length=1 is subtotal for booking
    //followed by trtags.length=1 is next unit
    var tt = 0;
    const STATE_SKIP          = 0;
    const STATE_UNIT          = 1;
    const STATE_BOOKING       = 2;
    const STATE_SUBTOTAL      = 3;
    var mystate = STATE_SKIP;
    for (tt=0; tt < tabletags.length; tt++)
    {
        const tr_tags = tabletags[tt].getElementsByTagName("tr");
        if (mystate == STATE_SKIP)
        {
            if ( tr_tags.length == 1 &&
                 tr_tags[0].getElementsByTagName("strong")[0].innerHTML.includes("Bookings"))
            {
                PrintTableUnit(tabletags[tt]);
                mystate = STATE_UNIT;
            }
        }
        else if (mystate == STATE_UNIT)
        {
            if (tr_tags.length == 8)
            {
                PrintTableBooking(tabletags[tt]);
                mystate = STATE_BOOKING;
            }
            else {
            	console.log("WARNING: bad tr_tags.length detection in STATE_UNIT!!!!!");
                break;
            }
        }
        else if (mystate == STATE_BOOKING)
        {
            if (tr_tags.length == 8)
                PrintTableBooking(tabletags[tt]); //and remain in mystate == STATE_BOOKING
            else if (tr_tags.length == 1)
            {
                PrintTableSubtotalAllBookingsForUnit(tabletags[tt]);
                mystate = STATE_SUBTOTAL;
            }
            else if (tr_tags.length == 4)
            {
            	PrintTableSpecialSmallBooking(tabletags[tt]);
                mystate = STATE_BOOKING;
            }
            else {
            	console.log("WARNING: bad tr_tags.length detection in STATE_BOOKING!!!!!");
                break;
            }
        }
        else if (mystate == STATE_SUBTOTAL)
        {
            if (tr_tags.length == 1)
            {
                PrintTableUnit(tabletags[tt]);
                mystate = STATE_UNIT;
            }
            else {
            	console.log("WANRING: bad tr_tags.length detection in STATE_SUBTOTAL!!!!!");
                break;
            }
        }
    }

    DebugGlobalSaveArray();

    console.log("END");
}

//DebugTestTableTags(document.getElementsByTagName("table"));
main();

