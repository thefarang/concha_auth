'use strict'

let documents = []

const connect = () => {
}

const disconnect = () => {
}

const find = () => {
  return documents
}

const findOne = (query) => {
  return documents.filter(doc => doc.roles.indexOf(query.roles) >= 0)
}

const save = (document) => {
  documents.push(document)
}

const removeAll = () => {
  documents = []
}

module.exports = {
  connect,
  disconnect,
  find,
  findOne,
  save,
  removeAll
}
