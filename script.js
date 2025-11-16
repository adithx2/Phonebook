const apiUrl = 'https://69196cf19ccba073ee92e497.mockapi.io/phonebook'

const contactForm = document.getElementById("addForm")
const contactList = document.getElementById("contactList")
const search = document.getElementById("search")

const getContacts = async() => {
    try {
        let response = await fetch(apiUrl);
        let data = await response.json();
        displayContacts(data);
    } catch (error) {
        console.log("Error fetching contacts", error);
    }
}
getContacts();

// Display Contacts

const displayContacts = async(contacts) =>{
    contactList.innerHTML = "";

    contacts.forEach(contact => {
        const li = document.createElement("li");

        li.className = "list-group-item d-flex justify-content-between align-items-center";


        li.innerHTML = `

            <span class="text-primary">${contact.Name}</span>
            <span class="text-secondary ">${contact.Phone}</span>

            ${contact.Name} - ${contact.Phone}

            <button class="btn btn-sm btn-success" onclick="editContact(${contact.id})">Edit</button>
            <button class="btn btn-sm btn-danger"onclick="deleteContact(${contact.id})">Delete</button>
        `;

        contactList.appendChild(li);
    });
}

// Add new contact

contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newContact = {
        Name: document.getElementById("name").value,
        Phone: document.getElementById("phone").value
    };

    try {
        await fetch(apiUrl, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newContact)
        });

        contactForm.reset();
        getContacts();
    } catch (error) {
        console.log("Error adding contact", error);
    }
});

// Delete Contact

const deleteContact = async(id) =>{
    try {
        await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        getContacts();
    } catch (error) {
        console.log("Error deleting contact", error);
    }
}

// Edit Contact

const editContact = async(id)=>{

    let response = await fetch(`${apiUrl}/${id}`);
    let contact = await response.json();

    let newName = prompt("Enter new name", contact.Name);
    let newPhone = prompt("Enter new phone number", contact.Phone);

    if (!newName || !newPhone) {
        alert("Edit cancelled!");
        return;
    }

    await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: newName,
            phone: newPhone
        })
    });

    getContacts();

}

// Search Contact

search.addEventListener("keyup", async () => {

    let query = search.value.toLowerCase();
    let response = await fetch(apiUrl);
    let data = await response.json();

    let filtered = data.filter(item =>
        item.Name.toLowerCase().includes(query) ||
        item.Phone.includes(query)
    );

    displayContacts(filtered);
});