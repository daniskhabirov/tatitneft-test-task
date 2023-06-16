import './ArticleList.css';
import React from 'react';
import { useStore } from 'effector-react';
import {
    $articles,
    remove,
    edit,
    visibleForm
} from './App';

function ArticleList() {
    const articles = useStore($articles);

    function filterTable() {
        const phrase = document.getElementById("filter-text");
        const table = document.getElementById("articles-table");
        const regPhrase = new RegExp(phrase.value, 'i');
        let flag = false;

        for (let i = 1; i < table.rows.length; i++) {
            flag = false;
            for (let j = table.rows[i].cells.length - 1; j >= 0; j--) {
                flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
                if (flag) break;
            }
            if (flag)
                table.rows[i].style.display = "";
            else
                table.rows[i].style.display = "none";
        }
    }

    return (
        <div className="table-wrapper">
            <div className="table-actions">
                <input id="filter-text" placeholder="Фильтр" onKeyUp={filterTable} />
                <button onClick={() => visibleForm(true)}>Добавить статью</button>
            </div>
            <div className="table-data">
                <table id="articles-table" className="articles-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Заголовок</th>
                            <th>Текст</th>
                            <th>Тема</th>
                            <th>Автор</th>
                            <th>Дата</th>
                            <th>Действия</th>
                        </tr>
                    </thead>

                    <tbody>
                        {articles.map((article, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{article.header}</td>
                                <td>{article.text}</td>
                                <td>{article.theme}</td>
                                <td>{article.author}</td>
                                <td>{new Date(article.date).toLocaleDateString()}</td>
                                <td>
                                    <div className="actions-wrapper">
                                        <button className="edit-action" onClick={() => {
                                            edit({
                                                isEdit: true,
                                                articleIndex: i
                                            });
                                            visibleForm(true);
                                        }}>редактировать</button>
                                        <button className="remove-action" onClick={() => {
                                            remove(i);
                                        }}>удалить</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ArticleList;
