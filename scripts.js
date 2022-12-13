function dynamicSort(array) {
    for (i = 0; i < array.length; i++) {
        for (var j = 0; j < array.length - i - 1; j++) {
            if (array[j].name > array[j + 1].name) {
                var temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
        }
    }
}
function arrayClear(array) {
    while (array.length > 0) {
        array.pop();
    }
}
class Article {
    constructor(name, marque, price, productionDate, type, promotion) {
        this.name = name;
        this.marque = marque;
        this.price = price;
        this.productionDate = productionDate;
        this.type = type;
        this.promotion = promotion;
    }
    details() {
        let message = ` 
    Nom: ${this.name} <br>
    Marque: ${this.marque} <br>
    Prix: ${this.price} <br>
    Date de publication: ${this.productionDate} <br>
    Type: ${this.type} <br>
    En promotion: ${this.promotion} <br>
  `;
        productsdetails.innerHTML = message;
        const detailsmodal = new bootstrap.Modal(
            document.getElementById("detailsmodal")
        ); // creating modal object
        detailsmodal.show();
    }
}
let products = [];
if (localStorage.getItem("products") != null) {
    storageData = JSON.parse(localStorage.getItem("products"));
    for (key in storageData) {
        products.push(
            new Article(
                storageData[key].name,
                storageData[key].marque,
                storageData[key].price,
                storageData[key].productionDate,
                storageData[key].type,
                storageData[key].promotion
            )
        );
    }
}
const errorCollection = [];
alertbox.style.display = "none";
domodify.style.display = "none";
function validation() {
    arrayClear(errorCollection);
    alertbox.style.display = "none";
    alertbox.innerHTML = "";
    let name = document.getElementById("namex").value;
    let marque = document.getElementById("marque").value;
    let price = document.getElementById("price").value;
    let productionDate = document.getElementById("productionDate").value;
    let type = document.getElementById("type").value;
    let promotion = document.getElementsByName("promotion");
    let myRegex = /^[a-zA-Z\s]+$/;
    let DateRegex = /^[1-9-/s]+$/;
    if (name.length === 0) {
        errorCollection.push("the name is required , can't be empty.");
    } else if (name.length > 30) {
        errorCollection.push("the max length for the name is 15.");
    } else if (myRegex.test(name) === false) {
        errorCollection.push("the name can't contain numbers");
    }
    if (marque.length === 0) {
        errorCollection.push("the marque is required , can't be empty.");
    } else if (marque.length > 30) {
        errorCollection.push("the max length for the marque is 30.");
    } else if (myRegex.test(marque) === false) {
        errorCollection.push("the marque can't contain numbers");
    }
    if (price.length === 0) {
        errorCollection.push("the price is required , can't be empty.");
    } else if (typeof Number(price) != "number") {
        errorCollection.push("the price can't contain letters");
    }
    if (productionDate.length === 0) {
        errorCollection.push("the date is required , can't be empty.");
    }
    if (type.length === 0) {
        errorCollection.push("the type is required.");
    }
    if (promotion[0].checked === false && promotion[1].checked === false) {
        errorCollection.push("please choose the promotion");
    }
    if (errorCollection.length > 0) {
        for (let i = 0; i < errorCollection.length; i++) {
            alertbox.style.display = "block";
            alertbox.innerHTML +=
                "<strong> error ! </strong>" + errorCollection[i] + "<br>";
        }
        return false;
    } else {
        return true;
    }
}
setInterval(() => {
    document.querySelector("tbody").innerHTML = "";
    for (key in products) {
        document.querySelector("tbody").innerHTML += `
 <tr>
      <td>${products[key].name}</td>
      <td> ${products[key].marque}</td>
      <td> ${products[key].price}</td>
      <td>${products[key].productionDate}</td>
      <td>${products[key].type}</td>
      <td>${products[key].promotion}</td>
      <td> <i  onclick='deletethis(${key})' data-bs-toggle="modal" data-bs-target="#deletionmodal" class="bi bi-trash"></i> <i onclick='modifythis(this)' id='${key}' class=" bi bi-pencil-square"></i> <i onclick='GetDetails(${key})' data-bs-toggle="modal"  class="bi bi-list-check"></i> </td>
    </tr>
    `;
    }
    dynamicSort(products);
}, 1000);
AddProduct.onclick = function (e) {
    e.preventDefault();
    if (validation()) {
        let formData = new Article(
            namex.value,
            marque.value,
            price.value,
            productionDate.value,
            type.value,
            document.querySelector("form").elements.namedItem("promotion").value
        );
        formData.details();
        products.push(formData);
        document.querySelector("form").reset();
        localStorage.setItem("products", JSON.stringify(products));
    }
};
function GetDetails(key) {
    products[key].details();
}
function deletethis(x) {
    document.getElementById("dodelete").setAttribute("onclick", `dodelete(${x})`);
}
function dodelete(x) {
    products.splice(x, 1);
    localStorage.setItem("products", JSON.stringify(products));
    document.getElementsByClassName("btn-close")[0].click();
}
function modifythis(element) {
    domodify.title = element.id;
    domodify.style.display = "block";
    AddProduct.style.display = "none";
    namex.value = products[Number(element.id)].name;
    marque.value = products[Number(element.id)].marque;
    price.value = products[Number(element.id)].price;
    productionDate.value = products[Number(element.id)].productionDate;
    type.value = products[Number(element.id)].type;
    document.querySelector("form").elements.namedItem("promotion").value =
        products[Number(element.id)].promotion;
}
domodify.onclick = function (e) {
    e.preventDefault();
    let index = domodify.title;
    if (validation()) {
        products[Number(index)].name = namex.value;
        products[Number(index)].marque = marque.value;
        products[Number(index)].price = price.value;
        products[Number(index)].productionDate = productionDate.value;
        products[Number(index)].type = type.value;
        products[Number(index)].promotion = document
            .querySelector("form")
            .elements.namedItem("promotion").value;
        domodify.style.display = "none";
        AddProduct.style.display = "block";
        document.querySelector("form").reset();
        localStorage.setItem("products", JSON.stringify(products));
    }
};
