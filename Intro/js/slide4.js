
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 설정
const firebaseConfig = {

};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 방명록 불러오기
async function loadGuestbookEntries() {
    const q = query(collection(db, "guestbook"), orderBy("date", "desc")); // 최신순 정렬
    let docs = await getDocs(q);

    docs.forEach((doc) => {
        let row = doc.data();
        let name = row['name'];
        let comment = row['comment'];
        let date = row['date'];

        let newBadgeHtml = "";
        let currentTime = new Date();
        let postedTime = new Date(date);
        let timeDiff = (currentTime - postedTime) / 1000; // 초 단위 차이

        if (timeDiff < 600) { // 10분 내에 작성된 글에만 "new" 배지 추가
            newBadgeHtml = `<img src="./img/new_icon.png" class="new-badge" alt="New">`;
        }

        let temp_html = `
        <div class="col">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-name">${name} ${newBadgeHtml}</h5>
                    <p class="card-text">${comment}</p>
                    <button class="btn btn-sm btn-dark toggle-comment" data-id="${doc.id}">⬇</button>
                    <div class="comment-box" id="comment-box-${doc.id}" style="display: none;">
                        <div class="comment-A">
                        <input type="text" class="form-control comment-input" id="comment-input-${doc.id}" placeholder="댓글을 입력하세요">
                        <button class="btn btn-sm btn-dark add-comment" data-id="${doc.id}">댓글 작성</button>
                        </div>
                        <div class="comment-list" id="comment-list-${doc.id}"></div>
                    </div>
                </div>
                <div class="card-footer">
                    <small class="text-muted">${date}</small>
                </div>
            </div>
        </div>`;

        $('#text').append(temp_html);
    });
}

async function loadComments(docId) {
    const q = query(collection(db, `guestbook/${docId}/comments`), orderBy("date", "asc"));
    let docs = await getDocs(q);
    $(`#comment-list-${docId}`).empty();

    docs.forEach((doc) => {
        let row = doc.data();
        let name = row['name'];
        let text = row['text'];
        let date = row['date'].toDate();
        let formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

        let commentHtml = `<div class="comment"><strong>${name}</strong>: ${text} <small>(${formattedDate})</small></div>`;
        $(`#comment-list-${docId}`).append(commentHtml);
    });
}

$(document).on("click", ".toggle-comment", function () {
    let docId = $(this).attr("data-id");
    $(`#comment-box-${docId}`).toggle();
    loadComments(docId);
});

async function addNewEntry(name, comment, date) {
    let newHtml = `
    <div class="col new-entry">
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-name">${name} 
                    <img src="./img/new_icon.png" class="new-badge" alt="New">
                </h5>
                <p class="card-text">${comment}</p>
            </div>
            <div class="card-footer">
                <small class="text-muted">${date}</small>
            </div>
        </div>
    </div>`;

    $('#text').prepend(newHtml);
}

$(document).ready(function () {
    loadGuestbookEntries();

    $("#postingbtn").click(async function () {
        let name = $('#name').val().trim();
        let comment = $('#comment').val().trim();

        if (!name || !comment) {
            return;
        }

        let currentDate = new Date();
        let date = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}`;

        let doc = { 'name': name, 'comment': comment, 'date': date };

        await addDoc(collection(db, "guestbook"), doc);
        alert('작성 완료');
        addNewEntry(name, comment, date);
    });
});

