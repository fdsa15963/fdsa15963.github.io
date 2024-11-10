$('#btn-json-viewer').click(function() {
    try {

        let jsonInput = document.querySelector(".json_input").value;

        jsonInput = jsonInput.replaceAll(/[\r|\n|\t]/g,"");

        if(jsonInput.search("'") != -1 && jsonInput.search('"') == -1){
            jsonInput = jsonInput.replaceAll("'", '"');
        }

        jsonInput = JSON.parse(jsonInput);

        $('#json-renderer').json_viewer(jsonInput);

    }catch (error) {
        alert("Error: 請確認資料是否有誤");
    }
});

if(document.querySelector(".json_input").value != ""){
    sortJson();
    $('#btn-json-viewer').click();
}


//讓檢視區資料摺疊起來
function closeJson(){
    let jsonAs = document.querySelector("#json-renderer").children[1].querySelectorAll(".json-toggle");

    for(let i = 0; i < jsonAs.length; i++){
        if(jsonAs[i].getAttribute("class") == "json-toggle"){
            jsonAs[i].click();
        }
    }
}

////讓檢視區資料展開起來
function openJson(){
    let jsonAs = document.querySelectorAll(".collapsed");

    for(let i = 0; i < jsonAs.length; i++){
        jsonAs[i].click();
    }
}

//整理編輯區JSON資料
function formatJson(decode){
    let jsonInput = document.querySelector(".json_input");


    if(decode){

        let output = JSON.stringify(JSON.parse(jsonInput.value), null, 4);
        
        jsonInput.value = output;

    }else{

        String.space = function(c) {
            var g = [], m;
            for (m = 0; m < c; m++)
                g.push(" ");
            return g.join("")
        }
        
        for (var text = jsonInput.value.replace(/\n/g, " ").replace(/\r/g, " "), array = [], b = 0, f = !1, i = 0; i < text.length; i++) {
            var h = text.charAt(i);
            f && h === f ? "\\" !== text.charAt(i - 1) && (f = !1) : f || '"' !== h && "'" !== h ? f || " " !== h && "\t" !== h ? f || ":" !== h ? f || "," !== h ? f || "[" !== h && "{" !== h ? f || "]" !== h && "}" !== h || (b--,
            h = "\n" + String.space(2 * b) + h) : (b++, h += "\n" + String.space(2 * b)) : h += "\n" + String.space(2 * b) : h += " " : h = "" : f = h;
            array.push(h)
        }
        jsonInput.value = array.join("");
            
    }

    
}

//移除編輯區空格
function removeJsonWhiteSpace() {
    let jsonInput = document.querySelector(".json_input");

    for (var text = jsonInput.value.replace(/\n/g, " ").replace(/\r/g, " "), array = [], b = !1, i = 0; i < text.length; i++) {

        var q = text.charAt(i);

        b && q === b ? "\\" !== text.charAt(i - 1) && (b = !1) : b || '"' !== q && "'" !== q ? b || " " !== q && "\t" !== q || (q = "") : b = q;

        array.push(q);
    }


    jsonInput.value = array.join("");
}

//排序編輯區JSON資料
function sortJson(){
    let jsonInput = document.querySelector(".json_input");

    jsonInput.value = sort(jsonInput.value);
}



//刪除編輯區
function clearJson(){
    let jsonInput = document.querySelector(".json_input");

    jsonInput.value = "";
}



// 匯出排序函數
function sort(inputStr, noarray = false) {
    try {
        const obj = JSON.parse(inputStr);
        return JSON.stringify(sortObj(obj, noarray), null, 4);
    } catch (ex) {
        console.error('jsonabc: 不正確的JSON對象。', [], ex);
        throw ex;
    }
}

// 遞歸排序對象
function sortObj(un, noarray) {

    if (Array.isArray(un)) {

        return noarray ? un : un.sort().map(item => sortObj(item, noarray));

    } else if (typeof un === 'object' && un !== null) {

        const sortedObj = {};

        Object.keys(un)
            .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
            .forEach(key => {
                sortedObj[key] = sortObj(un[key], noarray);
            });

        return sortedObj;
    }

    return un;
}

// 清理JSON字符串中多余的逗號
function cleanJSON(input) {
    return input.replace(/,[ \t\r\n]+}/g, '}').replace(/,[ \t\r\n]+\]/g, ']');
}