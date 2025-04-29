/*
    Core functions
*/

function Element_Get_ByID(ID){
	return document.getElementById(ID);
}

function Element_Get_ByQuery(Query){
	return document.querySelector(Query);
}

function Element_Get_ByQuery_All(Query){
	return document.querySelectorAll(Query);
}

function Element_Clear(ID){
	document.getElementById(ID).innerHTML = "";
}

function Element_Create(Type){
	return document.createElement(Type);
}

function Element_Append(ID, ChildToAppend){
	document.getElementById(ID).appendChild(ChildToAppend);
}

function Element_InnerHTML_Set(ID, Value){
	document.getElementById(ID).innerHTML = Value;
}

function Element_InnerText_Set(ID, Value){
	document.getElementById(ID).innerText = Value;
}

function Element_Value_Get(ID){
	return Element_Get_ByID(ID).value;
}

function Element_Value_Set(ID, Value){
	Element_Get_ByID(ID).value = Value;
}

function Element_Attribute_Set(ID, Attribute, Value){
    Element_Get_ByID(ID).setAttribute(Attribute, Value);
}

function Element_Attribute_Remove(ID, Attribute){
    Element_Get_ByID(ID).removeAttribute(Attribute);
}

function Element_Attribute_Get(ID, Attribute){
	return Element_Get_ByID(ID).getAttribute(Attribute);
}

function Element_Opacity_Set(ID, Opacity){
    if (Opacity >= 0 && Opacity <= 100){
		Element_Get_ByID(ID).style.opacity = Opacity + "%";
    }
}

function Element_Style_Animate(ElementID, Animation_Name, Animation_Duration, Animation_FillMode){
	document.getElementById(ElementID).style.animationName = Animation_Name;
	document.getElementById(ElementID).style.animationDuration = Animation_Duration;
	document.getElementById(ElementID).style.animationFillMode = Animation_FillMode;
}

function Element_Style_Animate_OnFinish_Display(ElementID, Animation_Name, Animation_Duration, Animation_FillMode, OnFinish_Display){
	document.getElementById(ElementID).style.animationName = Animation_Name;
	document.getElementById(ElementID).style.animationDuration = Animation_Duration;
	document.getElementById(ElementID).style.animationFillMode = Animation_FillMode;
	document.getElementById(ElementID).addEventListener("animationend", () => {
		Element_Style_Display(ElementID, OnFinish_Display);
	})
}

function Element_Style_Animate_Batch_QuerySelector(QuerySelector, Animation_Name, Animation_Duration, Animation_FillMode, Animation_Iteration, Animation_Delay){
	var Element_Delay = 0;
	var Element_QuerySelector = document.querySelectorAll(QuerySelector);
	for (a = 0; a < Element_QuerySelector.length; a++){
		Element_QuerySelector[a].style.animationName = Animation_Name;
		Element_QuerySelector[a].style.animationDuration = Animation_Duration;
		Element_QuerySelector[a].style.animationFillMode = Animation_FillMode;
		Element_QuerySelector[a].style.animationIterationCount = Animation_Iteration;
		Element_Delay += Animation_Delay;
		if (Animation_Delay != 0){
			Element_QuerySelector[a].style.animationDelay = Element_Delay + "ms";
		} else {
			Element_QuerySelector[a].style.animationDelay = "0s";
		}
		
	}
}

function Element_Style_Display(ElementID, ElementDisplay){
	document.getElementById(ElementID).style.display = ElementDisplay;
}

async function Page_ChangePage(URL, Transition_Function, OpenInTab){
	if (Transition_Function){
		await Transition_Function();
	}
	
	// Sample usage
	/*
		async function Test_Transition(){
			LoadingScreen_Show();
			return new Promise (resolve => setTimeout(resolve, 5000));
		}
	*/
	if (OpenInTab == "Current" || OpenInTab == null){
		window.location = URL;
	} else if (OpenInTab == "New") {
		window.open(URL, '_blank');
	}
}

function UF_Parameter_Get(Parameter){
    UF_Requested_Parameter = Parameter;
    UF_Parameter_Value = new URLSearchParams(window.location.search).get(Parameter);
    if (UF_Parameter_Value != null || UF_Parameter_Value != undefined){
        return UF_Parameter_Value;
    }
}

function UF_Parameter_Set(Parameter, Value){
    UF_URL_Parameter = new URLSearchParams(window.location.search);
    UF_URL_Parameter.set(Parameter, Value);
    UF_URL = window.location.pathname + '?' + UF_URL_Parameter.toString();
    window.history.pushState({}, '', UF_URL);
}

function UF_Parameter_Remove(Parameter){
	UF_URL_Parameter = new URLSearchParams(window.location.search);
    UF_URL_Parameter.delete(Parameter);
	if (UF_URL_Parameter.size > 0){
		UF_URL = window.location.pathname + '?' + UF_URL_Parameter.toString();
    	window.history.pushState({}, '', UF_URL);
	} else {
		UF_URL = window.location.pathname + UF_URL_Parameter.toString();
    	window.history.pushState({}, '', UF_URL);
	}
}

// Gets the current date
function Date_Get(){
    const CurrentDate = new Date();
    var Date_Month_Index = CurrentDate.getMonth();
    var Date_Month_Array = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var Date_Month = Date_Month_Array[Date_Month_Index];
    var Date_Day = CurrentDate.getDate();
    var Date_Year = CurrentDate.getFullYear();
    return `${Date_Day} ${Date_Month} ${Date_Year}`;
}

// Creates a unique key
function Key_Generate(){
    const Time = new Date();
    var Time_Month = Time.getMonth();
    var Time_Day = Time.getDate();
    var Time_Year = Time.getFullYear();
    var Time_Hours = Time.getHours();
    var Time_Minutes = Time.getMinutes();
    var Time_Seconds = Time.getSeconds();
    return `${Time_Year}${Time_Month}${Time_Day}_${Time_Hours}${Time_Minutes}${Time_Seconds}`;
}

function StorageItem_Set(Key, Data, Type){
	if (Type == "Local" || Type == null){
		localStorage.setItem(Key, JSON.stringify(Data));
	} else if (Type == "Session") {
		sessionStorage.setItem(Key, JSON.stringify(Data));
	}
}

function StorageItem_Get(Key, Type){
	if (Type == "Local" || Type == null){
		return JSON.parse(localStorage.getItem(Key));
	} else if (Type == "Session") {
		return JSON.parse(sessionStorage.getItem(Key));
	}
}

function Data_Import_FromPath(Path, Type){
	const request = new XMLHttpRequest();
    request.open("GET", Path, false);
    request.send();
    var Data_Raw = request.responseText;
    var Data_JSON = JSON.parse(Data_Raw);
	if (Type == "JSON" || Type == null){
		return Data_JSON;
	} else if (Type == "Raw") {
		return Data_Raw;
	}
}

function Data_Import(FileInputElementID, Type){
	var File_Element = document.getElementById(FileInputElementID);
    var File_Element_File = File_Element.files[0];
    const Reader = new FileReader();
    Reader.onload = function(e){
        const Data_Raw = e.target.result;
        const Data_JSON = JSON.parse(Data_Raw);
		if (Type == "JSON" || Type == null){
			return Data_JSON;
		} else if (Type == "Raw") {
			return Data_Raw;
		}
    }

    Reader.readAsText(File_Element_File);
}

function Data_Export(File_Data, File_Name, File_Extension, Type){
	var Data_Initial = File_Data;
	var Data_Final;
	if (Type == "JSON" || Type == null){
		Data_Final = JSON.stringify(Data_Initial, null, 2);
	} else if (Type == "Raw") {
		Data_Final = Data_Initial;
	}
	const Data_Blob = new Blob([Data_Final], {type: 'application/json'});
	saveAs(Data_Blob, `${File_Name}${File_Extension}`);
}