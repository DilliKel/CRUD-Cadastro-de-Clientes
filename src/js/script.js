const openModal = () => {
    const modal = document.querySelector('.modal')
    modal.classList.add('active')
}

const closeModal = () => {
    clearValues()
    const modal = document.querySelector('.modal')
    modal.classList.remove('active')
}

const getLocal = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocal = (db_client) => localStorage.setItem('db_client', JSON.stringify(db_client))

const createClient = (client) => {
    const db_client = getLocal()
    db_client.push(client)
    setLocal(db_client)
}

const readClient = () => getLocal()

const updateClient = (index, client) => {
    const db_client = readClient()
    db_client[index] = client
    setLocal(db_client)
}

const deleteClient = (index) => {
    const db_client = readClient()
    db_client.splice(index, 1)
    setLocal(db_client)
}

const isValid = () => {
    return document.getElementById('modal-form').reportValidity()
}

const saveClient = () => {
    if (isValid()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            numero: document.getElementById('numero').value,
            cidade: document.getElementById('cidade').value
        }
        if (document.getElementById('nome').dataset.new == 'new') {
            createClient(client)
            updateTable()
            closeModal()
        } else {
            const index = document.getElementById('nome').dataset.new
            updateClient(index, client)
            updateTable()
            closeModal()
        }
    }
}

const clearTable = () => {
    const dados = document.querySelectorAll('#corpo-tabela tr')
    dados.forEach((linha) => linha.parentNode.removeChild(linha))
}

const clearValues = () => {
    const clients = document.querySelectorAll('.inp-dados')
    clients.forEach((client) => client.value = '')
}

const updateTable = () => {
    const db_client = readClient()
    clearTable()
    db_client.forEach((client, index) => {
        const row = document.createElement('tr')
        row.innerHTML = `
                    <td>${client.nome}</td>
                    <td>${client.email}</td>
                    <td>${client.numero}</td>
                    <td>${client.cidade}</td>
                    <td class="acao">
                        <button id="editar" data-index="${index}">Editar</button>
                        <button id="excluir" data-index="${index}">Excluir</button>
                    </td>
        `

        document.getElementById('corpo-tabela').appendChild(row)
    })
}

const fillFilds = (client) => {
    document.getElementById('nome').value = client.nome,
    document.getElementById('email').value = client.email,
    document.getElementById('numero').value = client.numero,
    document.getElementById('cidade').value = client.cidade
}

const editClient = (index) => {
    const db_client = readClient()[index]
    fillFilds(db_client)
    document.getElementById('nome').dataset.new = index
    openModal()

}

const editDelete = (evento) => {
    const index = evento.target.dataset.index
    if (evento.target.id === 'editar') {
        editClient(index)
    } else {
        const client = readClient()[index]
        const response = confirm(`Confirmar para excluir o cliente: ${client.nome}?`)
        if (response) {
            deleteClient(index)
            updateTable()
        } 
    }
}

updateTable()

// Os Events
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)

document.getElementById('close')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.getElementById('corpo-tabela')
    .addEventListener('click', editDelete)

document.getElementById('cadastrarCliente')
    .addEventListener('click', () => {
        document.getElementById('nome').dataset.new = 'new'
    })