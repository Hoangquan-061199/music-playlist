const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'HQ_PLAYER'

const player = $(".player");
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.play-pause');
const progress = $('#progress');
const prevBtn = $('.prev-btn');
const nextBtn = $('.next-btn');
const randomBtn = $('.random');
const repeatBtn = $('.repeat');
const playList = $('.list-music');


const app = {

    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        {
            name: "Chỉ yêu mình em",
            singer: "Châu khải Phong",
            path: "./assets/music/Chi-Yeu-Minh-Em-Chau-Khai-Phong.mp3",
            image: "./assets/img/cyme.jpg"
        },
        {
            name: "Đánh mất em",
            singer: "Quan Đăng Trần",
            path: "./assets/music/Danh Mat Em - Quang Dang Tran.mp3",
            image: "./assets/img/dme.jpg"
        },
        {
            name: "Đừng chờ nhau nữa",
            singer: "Tăng Phúc",
            path: "./assets/music/DungChoAnhNua-TangPhuc-5187612.mp3",
            image: "./assets/img/dcan.jpg"
        },
        {
            name: "Gặp em đúng lúc",
            singer: "HacKyTu",
            path: "./assets/music/GapEmDungLucCover-HacKyTu-5349378.mp3",
            image: "./assets/img/gedl.jpg"
        },
        {
            name: "Giấc mơ trưa",
            singer: "Thuỳ Chi",
            path: "./assets/music/Giac-Mo-Trua-Thuy-Chi.mp3",
            image: "./assets/img/gmt.jpg"
        },
        {
            name: "Muộn rồi mà sao còn",
            singer: "Sơn Tùng MTP",
            path: "./assets/music/Muon Roi Ma Sao Con - Son Tung M-TP.mp3",
            image: "./assets/img/mrmsc.jpg"
        },
        {
            name: "Thời không sai lệch",
            singer: "Ngải Thần",
            path: "./assets/music/ThoiKhongSaiLech-NgaiThan-6919123.mp3",
            image: "./assets/img/tksl.jpg"
        },
        {
            name: "Tình yêu hoa gió",
            singer: "Trương Thế Vinh",
            path: "./assets/music/Tinh-Yeu-Hoa-Gio-Truong-The-Vinh.mp3",
            image: "./assets/img/tyhg.jpg"
        },
        {
            name: "Từng cho nhau",
            singer: "Hà Nhi",
            path: "./assets/music/Tung Cho Nhau - Ha Nhi.mp3",
            image: "./assets/img/tcn.jpg"
        },
        {
            name: "Windy Hill",
            singer: "羽肿",
            path: "./assets/music/WindyHill-VA-5941232.mp3",
            image: "./assets/img/windyhill.jpg"
        },
        {
            name: "Yến vô hiết",
            singer: "Tưởng Tuyết Nhi",
            path: "./assets/music/YenVoHiet-TuongTuyetNhiCherChiang-6520166.mp3",
            image: "./assets/img/yvh.jpg"
        },

    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="avatar">
                        <img src="${song.image}" alt="cyme" >
                    </div>
                    <div class="name-song">
                        <h2 class="title">${song.name}</h2>
                        <p class="singer">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playList.innerHTML = htmls.join("");
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },
    // Hàm lặng nghe sự kiện
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg'}
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity,
        });
        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
            
        }

        // Xử lý khi click play
        playBtn.onclick = function () {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Khi song được play 
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Khi song bị pause 
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đôi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = audio.currentTime * 100 / audio.duration;
                progress.value = progressPercent;
            }
        }

        // Xử lí khi tua song 
        progress.onchange = function (e) {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        // Khi prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
        }

        // Khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToCurrentSong();

        }

        // Xử lý random song bật / tắt
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Xử lý lặp lại một song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Lắng nghe hành vi click vào list-music
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                // Xử lý khi vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }

                // Xử ý khi click vào song option
                if(e.target.closest('.option')) {

                }
            }
        }

    },

    scrollToCurrentSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300);
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function() {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        this.defineProperties();
    
        // Lắng nghe / xử lý các xự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playlist
        this.render();

        //Hiển thị trạng thái ban đầu của button repeat & random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    
    }
}

app.start();