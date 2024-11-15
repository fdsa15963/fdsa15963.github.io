let db; // 儲存 SQLite 資料庫的變數
const sqliteTable = document.querySelector('.sqlite_table');
const output = document.querySelector('.sqlite_output');

document.querySelector('.sqlite_input').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) {
        alert("請選擇一個 SQLite 檔案！");
        return;
    }

    output.innerHTML = "正在載入資料庫...";

    try {
        const arrayBuffer = await file.arrayBuffer();

        // 初始化 SQL.js
        const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.7.0/${file}`
        });

        // 加載 SQLite 資料庫
        db = new SQL.Database(new Uint8Array(arrayBuffer));
        output.innerHTML = "\n  資料庫已載入！";


        // 顯示資料表名稱
        let tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
        sqliteTable.innerHTML = ""; // 清空舊的資料表名稱

        if (tables.length > 0) {
            tables[0].values.forEach(([tableName]) => {
                let details = document.createElement('details');

                details.innerHTML = `<summary>${tableName}<img src="./images/view.png" alt="查看" onclick="loadTable('${tableName}');"></summary>`;

                let columns = db.exec(`PRAGMA table_info(${tableName});`);
                
                columns[0].values.forEach((columnName)=>{
                    details.innerHTML += `<div>${columnName[1]}<span>${columnName[2]}</span></div>`;
                });

                sqliteTable.appendChild(details);
            });

        } else {
            sqliteTable.innerHTML = "<p>這個資料庫沒有資料表！</p>";
        }
    } catch (error) {
        console.error(error);
        output.innerHTML = "載入資料庫時發生錯誤：" + error.message;
    }
});


document.querySelector('.sqlite_commit_run').addEventListener('click', () => {
    if (!db) {
        alert("請先選擇並載入一個 SQLite 資料庫！");
        return;
    }

    let commit = document.querySelector('.sqlite_commit').value.trim();
    if (!commit) {
        alert("請輸入 SQL 語法！");
        return;
    }

    try {
        const result = db.exec(commit);
        if (result.length > 0) {
            renderTable(result[0]);
        } else {
            output.innerHTML = "<p>查詢完成，但沒有返回結果。</p>";
        }
    } catch (error) {
        console.error(error);
        output.innerHTML = `<p>執行 SQL 語法時發生錯誤：${error.message}</p>`;
    }
});

function loadTable(tableName) {
    if (!db) {
        alert("請先載入資料庫！");
        return;
    }

    try {
        const result = db.exec(`SELECT * FROM ${tableName} LIMIT 50`); // 限制顯示 50 筆資料

        if (result.length > 0) {
            renderTable(result[0]);
        } else {
            output.innerHTML = `<p>資料表 ${tableName} 沒有任何資料。</p>`;
        }

    } catch (error) {
        console.error(error);
        output.innerHTML = `<p>載入資料表時發生錯誤：${error.message}</p>`;
    }
}

function renderTable(result) {
    output.innerHTML = ""; // 清空輸出區域
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // 建立表頭
    const headerRow = document.createElement('tr');
    result.columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // 填充資料
    result.values.forEach(row => {
        const dataRow = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell !== null ? cell : 'NULL';
            dataRow.appendChild(td);
        });
        tbody.appendChild(dataRow);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    output.appendChild(table);
}