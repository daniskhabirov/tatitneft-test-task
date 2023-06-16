import './App.css';
import React, { useState } from 'react';
import ArticleList from './ArticleList.js';
import AddArticleForm from './AddArticleForm.js';
import {
  createStore,
  createEvent,
  createEffect,
  sample
} from 'effector';
import { useStore } from 'effector-react';

const initialValue = {
  header: '',
  text: '',
  theme: '',
  author: '',
  date: new Date()
}

const initialServiceData = {
  isEdit: false,
  articleIndex: null
}

// Events
export const submitted = createEvent();
export const setField = createEvent();
export const cleanFields = createEvent();
export const insert = createEvent();
export const remove = createEvent();
export const edit = createEvent();
export const articlesListUpdate = createEvent();
export const visibleForm = createEvent();

// Effects
export const sendFormFx = createEffect(formData => {
  const isFilledFields =
    formData &&
    formData.header &&
    formData.text &&
    formData.theme &&
    formData.author &&
    formData.date;

  if (isFilledFields) {
    const serviceData = $serviceData.getState();
    // TODO: edit data
    if (serviceData.isEdit) {
      const articles = $articles.getState();
      articles.splice(serviceData.articleIndex, 1, formData);
      articlesListUpdate([...articles]);  // for changes visibility
      edit(initialServiceData); // reset the service data
    } else {
      // TODO: insert data
      insert(formData);
    }
    cleanFields();
    visibleForm(false);
  } else {
    alert('Заполните обязательные поля)');
  }
})

// Stores
export const $form = createStore(initialValue)
  .on(setField, (state, { key, value }) => ({
    ...state,
    [key]: value
  }))
  .on(cleanFields, () => initialValue)

export const $articles = createStore([])
  .on(insert, (articles, newArticle) => [...articles, newArticle])  // insert new article to array
  .on(remove, (articles, index) => articles.filter((_, i) => i !== index))  // remove article by index
  .on(articlesListUpdate, (prevState, newState) => newState)  // update articles list after edit

// this is service data for editing
export const $serviceData = createStore(initialServiceData)
  .on(edit, (state, serviceData) => {
    // TODO: fill fields for editing
    const articles = $articles.getState();
    const editableArticle = articles[serviceData.articleIndex];
    for (let field in editableArticle)
      setField({
        key: field,
        value: editableArticle[field]
      })

    return serviceData
  })

export const $formVisibility = createStore(false)
  .on(visibleForm, (prevState, newState) => newState)

// Samples
sample({
  clock: submitted, // when `submitted` is triggered
  source: $form, // Take LATEST state from $form, and
  target: sendFormFx  // pass it to `sendFormFx`
})

// Watchers
submitted.watch(e => {
  e.preventDefault();
})

function App() {
  const [articleForm, setArticleForm] = useState(AddArticleForm());
  const formVisibility = useStore($formVisibility);

  return (
    <div className="wrapper">
      <div className="wrapper-content">
        <ArticleList />
        {formVisibility && articleForm}
      </div>
    </div>
  )
}

export default App