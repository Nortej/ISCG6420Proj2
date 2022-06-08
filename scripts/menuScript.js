//menu item object
function Item(Image, itemName, Price, Type){
    this.Image = Image;
    this.itemName = itemName;
    this.Price = Price;
    this.Type = Type;
}
//array of menu item objects
var itemArray =[]

//getting xml
if(window.XMLHttpRequest)
{
    xmlhttp=new XMLHttpRequest();
}
else{
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
}
xmlhttp.open("GET","menuData.xml", false);
xmlhttp.send();
XMLDoc=xmlhttp.responseXML;
var x=XMLDoc.getElementsByTagName("Item");

var IName ='';
var IImage='';
var IPrice=0;
var IType="";

//adding info from xml to item object, then to array
for(var i=0; i<x.length;i++){
    IName = x[i].getElementsByTagName("itemName")[0].childNodes[0].nodeValue;
    IImage = x[i].getElementsByTagName("Image")[0].childNodes[0].nodeValue;
    IPrice = x[i].getElementsByTagName("Price")[0].childNodes[0].nodeValue;
    IType = x[i].getElementsByTagName("Type")[0].childNodes[0].nodeValue;
    var item = new Item(IImage,IName, IPrice, IType);
    itemArray[i]=item;
}

//dynamically showing the menu table
function showMenu(){
    var displaytext='';
    var table = document.getElementById('menu');
    //insert rows and cells based on amount of items
    for(var i=0; i<itemArray.length;i++){

        var row = table.insertRow(i);
        var cellImage = row.insertCell(0);
        var cellName = row.insertCell(1);
        var cellPrice = row.insertCell(2);
        var cellType = row.insertCell(3);
        var cellSlider = row.insertCell(4);
        var image = itemArray[i].Image;

        cellImage.innerHTML = "<img src='" + image + "' width='200' height='150'>"
        cellName.innerHTML = itemArray[i].itemName;
        cellPrice.innerHTML = "$" + itemArray[i].Price;
        cellType.innerHTML = itemArray[i].Type;
        cellSlider.innerHTML = "<p id='sliderValue"+i+"' >0</p>" +
        "<input type='range' class='slider' max='10' min='0' value='0' id='slider" + i + "' target='"+itemArray[i].Price+"'>";
    }

    //each slider will update value for each item
    document.querySelectorAll(".slider").forEach(sliderValue=>{
        sliderValue.addEventListener('input', event =>{
            var i = sliderValue.id.substring(sliderValue.id.length-1);
            var output = document.getElementById("sliderValue"+i);
            output.innerHTML = sliderValue.value;
            calcluateTotal(); //calls function to update total price each time slider value updates
        })
    })

    //function to update total price based on slider values
    function calcluateTotal() {
        var total = 0;
        document.querySelectorAll(".slider").forEach(sliderOption => {
            var price = parseFloat(sliderOption.getAttribute("target"));
            total += price * sliderOption.value;
        });
        document.getElementById("menuTotal").innerHTML = "$" + total;
    }
}