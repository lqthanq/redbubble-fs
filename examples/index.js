const formDOM = document.querySelector("form");
const btnDOM = document.querySelector("button");

const formData = new FormData(formDOM);

btnDOM.onclick = function (event) {
    console.log("event:", event);

    event.preventDefault();

    const data = {};
    data.name = formData.get("name");
    data.age = formData.get("age");
    data.patterns = formData.get("patterns");
    data.slider = formData.get("slider");

    formData.set("text", 'Long text');

    console.log("data", data);

    fetch("/path/to/server", {
        method: "POST",
        body: formData,
    });
};
