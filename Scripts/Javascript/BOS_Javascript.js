let Directory_Content = [];
let Directory_Path = [];
let Directory_File_Index = "";

document.addEventListener('DOMContentLoaded', function(){
    Directory_File_Index = "Stuffs/Index.cbe_bos";
    Directory_Path = ["Stuff"];
    BOS_List_Load(Directory_File_Index, Directory_Path);
});

function BOS_List_Load(File_Index, File_Path_Array){
    Directory_Content = Data_Import_FromPath(File_Index);
    Directory_Path = File_Path_Array;
    for (a = 0; a < Directory_Path.length; a++){
        if (Directory_Content.find(item => item.Name == Directory_Path[a]) != null){
            if (Directory_Content.find(item => item.Name == Directory_Path[a]).Type == "Folder"){
                Directory_Content = Directory_Content.find(item => item.Name == Directory_Path[a]).Content;
            }
        }
    }
    if (Directory_Path.length > 1){
        Element_InnerHTML_Set("BOS_Explorer_Header_Title", Directory_Path[Directory_Path.length - 1]);
    }
    Element_Clear("BOS_Explorer_Breadcrumbs");
    for (b = 0; b < Directory_Path.length; b++){
        var Breadcrumb_Item = Element_Create('p');
        Breadcrumb_Item.setAttribute("class", "BOS_Explorer_Breadcrumbs_Item");
        Breadcrumb_Item.setAttribute("onclick", `BOS_Explore_Up(${b})`);
        Breadcrumb_Item.innerHTML = `${Directory_Path[b]} /`;
        Element_Append("BOS_Explorer_Breadcrumbs", Breadcrumb_Item);
    }
    BOS_List_Generate(Directory_Content);
}

function BOS_List_Generate(Item_Array){
    Element_Clear("BOS_Explorer_List");
    for (a = 0; a < Item_Array.length; a++){
        var Item = Item_Array[a];
        var Item_Name = Item.Name;
        var Item_Type = Item.Type;
        var Item_Extension = Item.Extension;
        let Item_InnerHTML = `
            <h2 class="BOS_Explorer_List_Item_Title">
                ${Item_Name}
            </h2>
            <p class="BOS_Explorer_List_Item_Subtitle">
                ${Item_Type}
            </p>
        `
        var Item_Element = Element_Create('button');
        Item_Element.setAttribute("class", "General_Button BOS_Explorer_List_Item");
        if (Item_Type == "Folder"){
            Item_Element.setAttribute("onclick", `BOS_Explore_Down('${Item_Name}')`);
        } else if (Item_Type == "File") {
            Item_Element.setAttribute("onclick", `BOS_File_Load(${a}, '${Item_Name}', '${Item_Extension}')`);
        }
        Item_Element.innerHTML = Item_InnerHTML;
        Element_Append("BOS_Explorer_List", Item_Element);
    }
}

function BOS_File_Load(Item_Index, Item_Name, Item_Extension){
    var Item = Directory_Content[Item_Index];
    var Item_Source = Item.Source;
    Element_Attribute_Set("BOS_Explorer_Preview_Frame", "src", Item_Source);
    var Frame = Element_Get_ByID("BOS_Explorer_Preview_Frame");
    const Frame_Content = Frame.contentDocument || Frame.contentWindow.document;
    console.log(Frame_Content);
}

function BOS_Explore_Down(Item_Name){
    Directory_Path.push(Item_Name);
    BOS_List_Load(Directory_File_Index, Directory_Path);
}

function BOS_Explore_Up(Path_Index){
    if (Path_Index == null){
        Directory_Path.pop();
        BOS_List_Load(Directory_File_Index, Directory_Path);
    } else {
        Directory_Path = Directory_Path.slice(0, Path_Index + 1);
        BOS_List_Load(Directory_File_Index, Directory_Path);
    }
}