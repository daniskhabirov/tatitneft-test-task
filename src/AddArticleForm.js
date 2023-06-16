import './AddArticleForm.css';
import React from 'react';
import { useStoreMap } from 'effector-react';
import {
    $form,
    cleanFields,
    setField,
    submitted,
    visibleForm
} from './App';

function AddArticleForm() {

    const Field = ({ name, type, placeholder }) => {
        const value = useStoreMap({
            store: $form,   // take $form's state
            keys: [name],   // watch for changes of `name`
            fn: values => values[name] || ''    // retrieve data from $form's state in this way
        })

        function handleChange(e) {
            setField({
                key: e.target.name,
                value: e.target.value
            });
        }

        return (
            <input
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
            />
        )
    }

    return (
        <div className="form-data">
            <form onSubmit={submitted} onReset={cleanFields}>
                <Field name="header" placeholder="Заголовок *" />
                <Field name="text" placeholder="Текст *" />
                <Field name="theme" placeholder="Тема *" />
                <Field name="author" placeholder="Автор *" />
                <Field name="date" placeholder="Дата *" type="date" />

                <div className="buttons-wrapper">
                    <button onClick={() => visibleForm(false)}>Отмена</button>
                    <button type="reset">Очистить</button>
                    <button type="submit">Сохранить</button>
                </div>
            </form>
        </div>
    )
}

export default AddArticleForm