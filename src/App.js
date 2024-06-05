import React, { useEffect, useRef, useState } from "react";
import { Button, Icon, Image as ImageBase, LoadingSuspense } from "components/elements";
import { Loading } from "components/elements/Loading";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import classNames from "classnames";
import { FormInput } from "components/elements/Form";
import { FormSelect } from "components/elements/Form/FormSelect";
import { SERVICE_ASYNC } from "services/async";
import audio1 from 'assets/media/sound-1.mp3';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { AnimatedText } from "components/elements/FrameMotion/AnimatedText";
import { Message } from "components/elements/Message";
import { DomUtils } from "utils/DomUtil";
import ReactPlayer from "react-player";
import { useClickAnywhere } from "utils/Hook";

const schema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập họ và tên !').min(5, 'Vui lòng nhập chính xác họ và tên'),
  thinking: yup.mixed().test('isValidObject', 'Bạn sẽ tham gia chứ ?', function (value) {
    if (!value) {
      return false;
    }
    return value.label && value.value;
  }).nullable().required('Bạn sẽ tham gia chứ ?'),
});

const hiddenMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 30px, rgba(0,0,0,1) 30px, rgba(0,0,0,1) 30px)`;
const visibleMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 30px)`;

export default function App() {
  // NOTE : PREFIX
  const prefixCls = 'page-main';
  const prefixSection = 'section';

  const [thinkOption, setThinkOption] = useState([
    { label: "Chắc chắn rồi, mình sẽ đến đám cưới bạn", value: "Chắc chắn rồi, mình sẽ đến đám cưới bạn" },
    { label: "Không chắc nữa", value: "Không chắc nữa" },
    { label: "Rất tiếc mình bận rồi", value: "Rất tiếc mình bận rồi" },
  ])
  // NOTE : CONSTANTS

  AOS.init();
  // NOTE : LOAD ASSETS
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const images = [
      require('assets/images/pictures/photobook/1NHA2416.webp'),
      require('assets/images/pictures/photobook/1NHA2466.webp'),
      require('assets/images/pictures/photobook/1NHA2437.webp'),
    ];

    const fonts = [
      require('assets/fonts/LeJourScript-Eaqpg.woff'),
      require('assets/fonts/PlayfairDisplay-Regular.woff'),
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap&family=Public+Sans:wght@400;500;600;700&family=Bonheur+Royale&family=Great+Vibes&display=swap"
    ];

    const mediaResources = [...images, ...fonts];

    const preloadResources = async () => {
      const promises = mediaResources.map((resource) => new Promise((resolve, reject) => {
        const img = new Image();
        img.src = resource;
        img.onload = resolve;
        img.onerror = reject;
      }));

      try {
        await Promise.all(promises);
        setIsReady(true); // All resources loaded successfully
      } catch (error) {
        console.error('Error preloading resources:', error);
        // Handle error
      }
    };

    preloadResources();
  }, []);

  // NOTE : Calendar
  const [daysInMonth, setDaysInMonth] = useState([]);
  const generateCalendar = () => {
    const month = 6;
    const year = 2024;
    const daysInMonthFn = [];

    // Số ngày trong tháng
    const totalDays = new Date(year, month, 0).getDate();

    // Ngày đầu tiên của tháng
    const firstDay = new Date(year, month - 1, 1).getDay();

    // Thêm các ngày trước tháng
    const prevMonthDays = new Date(year, month - 1, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      daysInMonthFn.push({ day: prevMonthDays - i, class: 'prev-month' });
    }

    // Thêm các ngày trong tháng
    for (let i = 1; i <= totalDays; i++) {
      daysInMonthFn.push({ day: i, class: i === 30 ? 'special-day' : '' });
    }

    // Thêm các ngày sau tháng
    const lastDay = new Date(year, month, 0).getDay();
    const nextMonthDays = 7 - lastDay - 1;
    for (let i = 1; i <= nextMonthDays; i++) {
      daysInMonthFn.push({ day: i, class: 'next-month' });
    }

    setDaysInMonth(daysInMonthFn);
  };
  // NOTE : EFFECT
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // Code to execute in production mode
      // console.log('Production Mode');
      DomUtils.addEventListener(window, 'contextmenu', event => event.preventDefault());
      console.clear(); // Xóa hết thông báo trên console
      console.log('%c Dừng lại!', 'color: red; font-weight: bold; font-size: 30px');
    }
  });
  useEffect(() => {
    generateCalendar();
  }, [])
  // NOTE : FUNCTIONS
  // NOTE : Form
  const submitForm = async (data) => {
    console.log({ data, errors });
    try {
      Loading.show();
      const fieldName = 'entry.508613736';
      const fieldMessage = 'entry.1977543826';
      const fieldThinking = 'entry.1117437161';
      let formData = new FormData();

      formData.append(fieldName, data?.name);
      formData.append(fieldMessage, data?.message);
      formData.append(fieldThinking, data?.thinking?.value);
      await SERVICE_ASYNC.POST({
        rootUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdhEWoFjG1kz_xUzCaQy3YiVRlTxtLrTFqm4MIN1mtQUyGmXg',
        url: '/formResponse',
        params: formData
      })
      Loading.hide();
      Message.success({
        icon: 'success',
        message: "Cảm ơn bạn đã phản hồi",
        buttons: [
          {
            className: 'btn-primary',
            action: () => {
              window.location.reload();
            },
            content: 'OK'
          }
        ]
      })
    } catch (error) {
      Loading.hide();
    }
  }
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  // NOTE : Player
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);
  const onPlayPauseClick = () => {
    setPlaying(prev => !prev);
    setIsPlaying(prev => !prev);
    setIsPause(true);
  }
  useClickAnywhere(() => {
    if (isPause || isPlaying) return;
    setPlaying(true);
    setIsPlaying(true);
  });

  const RNPlayer = () => {
    return (
      <div className="player-float">
        <div className="player">
          <ReactPlayer
            ref={playerRef}
            className='player-audio'
            url={audio1}
            playing={playing}
            controls={true}
            loop={true}
          // muted={muted}
          // onReady={() => console.log('onReady')}
          // onStart={() => console.log('onStart')}
          />
          <div className="player-content">
            <div className={classNames("player-element player-element-lp", isPlaying && "active")} onClick={onPlayPauseClick}>
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 799 799" xmlSpace="preserve">
                <path fill="#181819" d="M399,0C178.6,0,0,178.6,0,399s178.6,399,399,399s399-178.6,399-399S619.4,0,399,0z M399,408.8c-5.4,0-9.8-4.4-9.8-9.8s4.4-9.8,9.8-9.8s9.8,4.4,9.8,9.8S404.4,408.8,399,408.8z" />
                <g fill="#181819" stroke="#060606" strokeWidth="1.5">
                  <path d="M399,19C189.1,19,19,189.1,19,399s170.1,380,380,380s380-170.1,380-380S608.9,19,399,19z M398.2,413.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S406.8,413.8,398.2,413.8z" />
                  <path d="M399,29C194.7,29,29,194.6,29,399s165.7,370,370,370s370-165.7,370-370S603.3,29,399,29z M398.2,413.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S406.8,413.8,398.2,413.8z" />
                  <path d="M399,39C200.2,39,39,200.2,39,399s161.2,360,360,360s360-161.2,360-360S597.8,39,399,39z M398.2,413.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S406.8,413.8,398.2,413.8z" />
                  <path d="M399,49C205.7,49,49,205.7,49,399s156.7,350,350,350s350-156.7,350-350S592.3,49,399,49z M398.2,413.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S406.8,413.8,398.2,413.8z" />
                  <path d="M399,59C211.2,59,59,211.2,59,399s152.2,340,340,340s340-152.2,340-340S586.8,59,399,59z M398.2,413.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S406.8,413.8,398.2,413.8z" />
                  <path d="M399,69C216.8,69,69,216.8,69,399s147.8,330,330,330s330-147.8,330-330S581.2,69,399,69z M398.2,413.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S406.8,413.8,398.2,413.8z" />
                  <path d="M399,79C222.3,79,79,222.3,79,399s143.3,320,320,320s320-143.3,320-320S575.7,79,399,79z M398.2,413.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S406.8,413.8,398.2,413.8z" />
                  <path d="M399,89C227.8,89,89,227.8,89,399s138.8,310,310,310s310-138.8,310-310S570.2,89,399,89z M398.2,413.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S406.8,413.8,398.2,413.8z" />
                  <path d="M399,99C233.3,99,99,233.3,99,399s134.3,300,300,300s300-134.3,300-300S564.7,99,399,99z M398.2,413.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S406.8,413.8,398.2,413.8z" />
                  <path d="M399,109c-160.2,0-290,129.8-290,290s129.8,290,290,290s290-129.8,290-290S559.2,109,399,109z M398.2,413.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S406.8,413.8,398.2,413.8z" />
                  <path d="M399,119c-154.6,0-280,125.4-280,280s125.4,280,280,280s280-125.4,280-280S553.6,119,399,119z M398.2,413.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S406.8,413.8,398.2,413.8z" />
                  <path d="M399,129c-149.1,0-270,120.9-270,270s120.9,270,270,270s270-120.9,270-270S548.1,129,399,129z M398.2,413.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S406.8,413.8,398.2,413.8z" />
                  <path d="M399,139c-143.6,0-260,116.4-260,260s116.4,260,260,260s260-116.4,260-260S542.6,139,399,139z M398.2,413.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S406.8,413.8,398.2,413.8z" />
                  <path d="M399,149c-138.1,0-250,111.9-250,250s111.9,250,250,250s250-111.9,250-250S537.1,149,399,149z M398.2,413.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S406.8,413.8,398.2,413.8z" />
                  <path d="M399,159c-132.5,0-240,107.5-240,240s107.5,240,240,240s240-107.5,240-240S531.5,159,399,159z M398.2,413.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S406.8,413.8,398.2,413.8z" />
                  <path d="M399,169c-127,0-230,103-230,230s103,230,230,230s230-103,230-230S526,169,399,169z M398.2,413.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S406.8,413.8,398.2,413.8z" />
                  <path d="M399,179c-121.5,0-220,98.5-220,220s98.5,220,220,220s220-98.5,220-220S520.5,179,399,179z M398.2,413.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S406.8,413.8,398.2,413.8z" />
                  <path d="M399,189c-116,0-210,94-210,210s94,210,210,210s210-94,210-210S515,189,399,189z M398.2,413.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S406.8,413.8,398.2,413.8z" />
                  <path d="M399,199c-110.5,0-200,89.5-200,200s89.5,200,200,200s200-89.5,200-200S509.5,199,399,199z M398.2,413.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S406.8,413.8,398.2,413.8z" />
                </g>
                <path id="cover" fill="#4BB749" fillOpacity={0} d="M399,261.1c-76.1,0-137.9,61.7-137.9,137.9S322.9,536.9,399,536.9S536.9,475.1,536.9,399S475.1,261.1,399,261.1z M399,410.7c-6.4,0-11.7-5.2-11.7-11.7s5.2-11.7,11.7-11.7s11.7,5.2,11.7,11.7S405.4,410.7,399,410.7z" />
                <g>
                  <clipPath id="coverClip">
                    <path d="M399,261.1c-76.1,0-137.9,61.7-137.9,137.9S322.9,536.9,399,536.9S536.9,475.1,536.9,399S475.1,261.1,399,261.1z M399,410.7c-6.4,0-11.7-5.2-11.7-11.7s5.2-11.7,11.7-11.7s11.7,5.2,11.7,11.7S405.4,410.7,399,410.7z" />
                  </clipPath>
                </g>
                <image xlinkHref={require('assets/images/pictures/bg-music.webp')} x={100} y={122} height="600px" width="600px" clipPath="url(#coverClip)" />
              </svg>
            </div>
            <div className={classNames("player-element player-element-tonearm", isPlaying && "active")}>
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="-340 -230 800 800" xmlSpace="preserve">
                <path fill="#C1C1C5" d="M24.4,521.9l11.9,6.2c0,0,37.1-91.5,42.4-123.7c2.7-16.4-1.1-103.9-1.1-103.9V67.8H62.9l-0.1,232.7c0,0,3.7,87.5,1.1,103.9C58.9,434.9,24.4,521.9,24.4,521.9z" />
                <rect x="49.6" fill="#5b5b5f" width="40.7" height="67.8" />
                <circle fill="#5b5b5f" cx="69.9" cy="160.3" r="22.6" />
                <path fill="#5b5b5f" d="M22.9,499.2l18.3-22.9l13.2,6.4l-6.2,28.7l-22.8,47.1c0,0-1.2,3.3-15.4-3.6c-11.2-5.4-10-8.7-10-8.7L22.9,499.2z" />
              </svg>
            </div>
            <div className={classNames("player-element player-element-muzieknootjes", isPlaying && "active")}>
              <div className="noot-1">
                ♫ ♩
              </div>
              <div className="noot-2">
                ♩
              </div>
              <div className="noot-3">
                ♯ ♪
              </div>
              <div className="noot-4">
                ♪
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
  // NOTE : Frame motion
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"]
  });
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollY(latest);
  })
  // NOTE : RN
  if (isReady) {
    return (<LoadingSuspense />)
  }
  return (
    <>
      <div className="click-anywhere-listener" style={{ display: 'none' }} />
      <main className={prefixCls}>
        {RNPlayer()}
        <div className={`${prefixSection}-block-1`}>
          <div className={`${prefixSection}-card`}>
            <div className={`${prefixSection}-card-item`}>
              <div className={`${prefixSection}-card-item__inner`}>
                <motion.div
                  className={`${prefixSection}-card-item__image`}
                  initial={false}
                  animate={
                    isInView
                      ? { WebkitMaskImage: visibleMask, maskImage: visibleMask }
                      : { WebkitMaskImage: hiddenMask, maskImage: hiddenMask }
                  }
                  transition={{ duration: 0.5, delay: 0 }}
                  viewport={{ once: true }}
                  onViewportEnter={() => setIsInView(true)}
                >
                  <ImageBase src={require('assets/images/pictures/photobook/1NHA2416.webp')} />
                </motion.div>
                <div className={`${prefixSection}-card-item__text`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <span>3</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <span>0</span>
                  </motion.div>
                </div>
              </div>
            </div>
            <div className={`${prefixSection}-card__item`}>
              <div className={`${prefixSection}-card-item__inner`}>
                <motion.div
                  className={`${prefixSection}-card-item__image`}
                  initial={false}
                  animate={
                    isInView
                      ? { WebkitMaskImage: visibleMask, maskImage: visibleMask }
                      : { WebkitMaskImage: hiddenMask, maskImage: hiddenMask }
                  }
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  onViewportEnter={() => setIsInView(true)}
                >
                  <ImageBase src={require('assets/images/pictures/photobook/1NHA2466.webp')} />
                </motion.div>
                <div className={`${prefixSection}-card-item__text`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <span>0</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    viewport={{ once: true }}
                  >
                    <span>6</span>
                  </motion.div>
                </div>
              </div>
            </div>
            <div className={`${prefixSection}-card__item`}>
              <div className={`${prefixSection}-card-item__inner`}>
                <motion.div
                  className={`${prefixSection}-card-item__image`}
                  initial={false}
                  animate={
                    isInView
                      ? { WebkitMaskImage: visibleMask, maskImage: visibleMask }
                      : { WebkitMaskImage: hiddenMask, maskImage: hiddenMask }
                  }
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  onViewportEnter={() => setIsInView(true)}
                >
                  <ImageBase src={require('assets/images/pictures/photobook/1NHA2437.webp')} />
                </motion.div>
                <div className={`${prefixSection}-card-item__text`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <span>2</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                    viewport={{ once: true }}
                  >
                    <span>4</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${prefixSection}-typography`}>
            <div className={`${prefixSection}-typography-text`}>
              <AnimatedText once text="Thanh Thắng" el="h6" />
              <span className="deco" data-aos="zoom-in" data-aos-delay="400"><ImageBase src={require('assets/images/pictures/4e37162a-1813-47ec-84aa-93c6a449996b.webp')} /></span>
              <AnimatedText once text="Trúc Vy" el="h6" />
            </div>
          </div>
        </div>
        <div className={`${prefixSection}-block-2`}>
          <div
            style={{ backgroundPositionY: `${(scrollY * 50) + 15}%` }}
            className={`${prefixSection}-block-background`}
          ></div>
          <div className={`${prefixSection}-block-text`}>
            <h5 data-aos="fade-up">WEDDING</h5>
            <span data-aos="fade-up" data-aos-delay="100">invitation</span>
          </div>
        </div>
        <div className={`${prefixSection}-block-3`}>
          <div className={`${prefixSection}-container`}>
            <div className={`${prefixSection}-block-title`}>
              <div className={`${prefixSection}-block-title__text`} data-aos="fade-up">
                <span data-aos="fade-in" data-aos-delay="100">SAVE</span>
                <span data-aos="fade-in" data-aos-delay="150">THE</span>
                <span data-aos="fade-in" data-aos-delay="200">DATE</span>
              </div>
            </div>
            <div className={`${prefixSection}-block-typography`}>
              <p>
                <AnimatedText once text="Âu Thanh Thắng" />
              </p>
              <p>and</p>
              <p>
                <AnimatedText once text="Cao Thị Trúc Vy" />
              </p>
            </div>
            <div className={`${prefixSection}-block-element`} data-aos="fade-in">
              <div className={`${prefixSection}-block-text`}>
                <span>11:00</span>
                <span>Chủ nhật</span>
              </div>
              <div className={`${prefixSection}-block-text`}>
                <span>Tháng 06</span>
                <span>30</span>
                <span>(Nhằm ngày 25 tháng 5 năm Giáp Thìn)</span>
              </div>
              <div className={`${prefixSection}-block-text`}>
                <span>2024</span>
              </div>
            </div>
            <div className={`${prefixSection}-block-address`} data-aos="fade-in">
              <span>Tại <strong>Tư Gia</strong></span>
              <span>(Ấp Nha Sáp - Xã Vĩnh Điều - Giang Thành - Kiên Giang)</span>
            </div>
            <div className={`${prefixSection}-block-calendar`} data-aos="fade-in">
              <h5>Tháng 6 - 2024</h5>
              <table>
                <thead>
                  <tr>
                    <th>CN</th>
                    <th>Thứ 2</th>
                    <th>Thứ 3</th>
                    <th>Thứ 4</th>
                    <th>Thứ 5</th>
                    <th>Thứ 6</th>
                    <th>Thứ 7</th>
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2, 3, 4, 5].map(week => (
                    <tr key={week}>
                      {[0, 1, 2, 3, 4, 5, 6].map(day => {
                        const index = week * 7 + day;
                        return (
                          <td
                            key={day}
                            className={daysInMonth[index] ? daysInMonth[index].class : ''}
                          >
                            {daysInMonth[index] && daysInMonth[index].day}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className={`${prefixSection}-block-4`}>
          <div className={`${prefixSection}-container`}>
            <div className={`${prefixSection}-block-header`} data-aos="fade-up" data-aos-anchor=".section-block-4">
              <h5>Our photobook</h5>
            </div>
            <div className={`gallery`}>
              <figure className="gallery__item gallery__item--1" data-aos="fade-up-right">
                <img src={require('assets/images/pictures/photobook/1NHA2450.webp')} alt="Wedding Thang & Vy" className="gallery__img" />
              </figure>
              <figure className="gallery__item gallery__item--2" data-aos="fade-up-left">
                <img src={require('assets/images/pictures/photobook/1NHA2711.webp')} alt="Wedding Thang & Vy" className="gallery__img" />
              </figure>
              <figure className="gallery__item gallery__item--3" data-aos="fade-up-right">
                <img src={require('assets/images/pictures/photobook/1NHA2437.webp')} alt="Wedding Thang & Vy" className="gallery__img" />
              </figure>
              <figure className="gallery__item gallery__item--4" data-aos="fade-up">
                <img src={require('assets/images/pictures/photobook/1NHA2424.webp')} alt="Wedding Thang & Vy" className="gallery__img" />
              </figure>
              <figure className="gallery__item gallery__item--5" data-aos="fade-up">
                <img src={require('assets/images/pictures/photobook/1NHA2786.webp')} alt="Wedding Thang & Vy" className="gallery__img" />
              </figure>
              <figure className="gallery__item gallery__item--6" data-aos="fade-up-left">
                <img src={require('assets/images/pictures/photobook/1NHA2707.webp')} alt="Wedding Thang & Vy" className="gallery__img" />
              </figure>
              <figure className="gallery__item gallery__item--7" data-aos="fade-up-right">
                <img src={require('assets/images/pictures/photobook/1NHA2416.webp')} alt="Wedding Thang & Vy" className="gallery__img" />
              </figure>
              <figure className="gallery__item gallery__item--8" data-aos="fade-up">
                <img src={require('assets/images/pictures/photobook/1NHA2466.webp')} alt="Wedding Thang & Vy" className="gallery__img" />
              </figure>
              <figure className="gallery__item gallery__item--9" data-aos="fade-up">
                <img src={require('assets/images/pictures/photobook/1NHA2553.webp')} alt="Wedding Thang & Vy" className="gallery__img" />
              </figure>
              <figure className="gallery__item gallery__item--10" data-aos="fade-up-left">
                <img src={require('assets/images/pictures/photobook/1NHA2613.webp')} alt="Wedding Thang & Vy" className="gallery__img" />
              </figure>
              <figure className="gallery__item gallery__item--11" data-aos="fade-up">
                <img src={require('assets/images/pictures/photobook/1NHA2445.webp')} alt="Wedding Thang & Vy" className="gallery__img" />
              </figure>
            </div>
          </div>
        </div>
        <div className={`${prefixSection}-block-5`}>
          <div className={`${prefixSection}-container`}>
            <div className={`${prefixSection}-block-header`}>
              <h5 data-aos="fade-in">BẠN SẼ THAM DỰ CHỨ ?</h5>
              <p data-aos="fade-in">Thật vui vì được gặp và đón tiếp bạn trong một dịp đặc biệt như đám cưới của chúng mình. Đám cưới của chúng mình sẽ trọn vẹn hơn khi có thêm lời chúc phúc và sự hiện diện của các bạn. Xin hãy xác nhận sự có mặt của mình để chúng mình chuẩn bị đón tiếp một cách chu đáo nhất nhé! Trân trọng!</p>
            </div>
            <div className={`${prefixSection}-block-form`}>
              <div className={classNames(`${prefixSection}-form-block`)}>
                <FormInput
                  label='Họ và tên *'
                  name="name"
                  autoFocus
                  floating={true}
                  register={register} required hint={errors?.name?.message} status={errors?.name?.message ? 'error' : ''} />
              </div>
              <div className={classNames(`${prefixSection}-form-block`)}>
                <FormInput
                  label='Gửi những lời chúc tốt đẹp'
                  name="message"
                  required
                  type='textarea'
                  rows={3}
                  register={register} />
              </div>
              <div className={classNames(`${prefixSection}-form-block`)}>
                {console.log(errors)}
                <FormSelect
                  control={control}
                  name='thinking'
                  label="Bạn sẽ tham gia chứ ?"
                  placeholder="Bạn sẽ tham gia chứ ?"
                  options={thinkOption}
                  hint={errors?.thinking?.message}
                  status={errors?.thinking?.message ? 'error' : ''}
                />
              </div>
              <div className={classNames(`${prefixSection}-form-block ${prefixSection}-form-btn`)}>
                <Button className='btn-primary' onClick={handleSubmit(submitForm)}>Phản hồi</Button>
              </div>
            </div>
          </div>
        </div>
        
      </main>
      <footer className="footer">
        <p>© 2024 by ATT</p>
      </footer>
    </>
  )
}

// <div className={`${prefixSection}-block-6`}>
//           <div className={`${prefixSection}-container`}>
//             <div className={`${prefixSection}-block-header`}>
//               <h5 data-aos="fade-in">♥ Hộp mừng cưới ♥</h5>
//               <p data-aos="fade-in">Cảm ơn vì những lời chúc của bạn, chúng mình mong rằng bạn sẽ dành chút thời gian để đến chung vui cùng chúng mình đấy!!!</p>
//             </div>
//             <div className={`${prefixSection}-block-qrcode`}>
//               {/**<div className="qrcode">
//                 <img src={require('assets/images/pictures/qrcode-1.webp')} alt="Hộp mừng cưới" />
//               </div> */}
//               <div className="qrcode">
//                 <img src={require('assets/images/pictures/qrcode-2.webp')} alt="Hộp mừng cưới" />
//               </div>
//             </div>
//           </div>
//         </div>
