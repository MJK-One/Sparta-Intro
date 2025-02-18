const teamData = [
    { name: "김민준", img: "./img/민준.png", info: "포기란 김장", mbti: "ENTJ", blog: "https://onedrinkim.tistory.com/" },
    { name: "기원", img: "./img/기원.png", info: "잘 부탁드리겠습니다.", mbti: "ENTP", blog: "https://velog.io/@giwon_wg/posts" },
    { name: "김광민", img: "./img/광민.png", info: "화이팅!", mbti: "INTP", blog: "https://kk97.tistory.com/" },
    { name: "김관형", img: "./img/관형.png", info: "비전공자라 부족하지만 잘 부탁드립니다.", mbti: "ISFJ", blog: "https://kimgh961021.tistory.com/" },
];

// 팀원 클릭 시 모달 열기 이벤트 추가
document.addEventListener("DOMContentLoaded", function () {
    const teamMembers = document.querySelectorAll(".team-member");  // 팀원 목록 가져오기
    teamMembers.forEach((member, index) => {
        member.addEventListener("click", function () {
            openModal(index);
        });
    });

    // 모달 초기 숨김 처리
    const modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "none";
    }
});

// 모달 열기
function openModal(index) {
    const modal = document.getElementById("modal");

    if (!teamData || !teamData[index]) return; 

    document.getElementById("modal-img").src = teamData[index].img;
    document.getElementById("modal-name").innerText = teamData[index].name;
    document.getElementById("modal-info").innerText = " " + teamData[index].info;
    document.getElementById("modal-mbti").innerText = "MBTI: " + teamData[index].mbti;
    document.getElementById("modal-blog").innerHTML = `<a href="${teamData[index].blog}" target="_blank">블로그 방문</a>`;

    modal.style.display = "flex"; // 클릭했을 때만 표시
}

// 모달 닫기
function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// 모달 바깥 영역 클릭 시 닫기
window.addEventListener("click", function(event) {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
        closeModal();
    }
});