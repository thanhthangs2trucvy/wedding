import React, { useEffect, useState } from "react";
import { Button, Image } from "components/elements";
import { Loading } from "components/elements/Loading";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import classNames from "classnames";
import { FormInput } from "components/elements/Form";
import { FormSelect } from "components/elements/Form/FormSelect";
import { SERVICE_ASYNC } from "services/async";
import audio1 from 'assets/media/sound-1.mp3';
import audio2 from 'assets/media/sound-2.mp3';
import AOS from 'aos';
import 'aos/dist/aos.css';
import AudioPlayer from "components/elements/AudioPlayer/AudioPlayer";
import { motion } from "framer-motion";
import { AnimatedText } from "components/elements/FrameMotion/AnimatedText";
import { Message } from "components/elements/Message";

const schema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập họ và tên !').min(5, 'Vui lòng nhập chính xác họ và tên'),
});

const hiddenMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 30px, rgba(0,0,0,1) 30px, rgba(0,0,0,1) 30px)`;
const visibleMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 30px)`;

export default function App() {
  // NOTE : PREFIX
  const prefixCls = 'page-main';
  const prefixSection = 'section';
  AOS.init();
  // NOTE : CONSTANTS
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
      daysInMonthFn.push({ day: i, class: i === 2 ? 'special-day' : '' });
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
    generateCalendar();
  }, [])
  // NOTE : FUNCTIONS
  // NOTE : Form
  const submitForm = async (data) => {
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
  const tracks = [
    { audioSrc: audio2, image: require('assets/images/pictures/photobook/1NHA2416.webp') },
    { audioSrc: audio1, image: require('assets/images/pictures/photobook/1NHA2692.webp') },
  ]
  const RNPlayer = (tracks) => {
    return (
      <div className="player-float">
        <AudioPlayer tracks={tracks} />
      </div>
    )
  }

  // NOTE : Frame motion
  const [isInView, setIsInView] = useState(false);
  // NOTE : RN
  return (
    <>
      <main className={prefixCls}>
        {RNPlayer(tracks)}

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
                  <Image src={require('assets/images/pictures/photobook/1NHA2416.webp')} />
                </motion.div>
                <div className={`${prefixSection}-card-item__text`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <span>0</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <span>2</span>
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
                  <Image src={require('assets/images/pictures/photobook/1NHA2466.webp')} />
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
                  <Image src={require('assets/images/pictures/photobook/1NHA2437.webp')} />
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
              <span className="deco" data-aos="zoom-in" data-aos-delay="300"><Image src={require('assets/images/pictures/4e37162a-1813-47ec-84aa-93c6a449996b.webp')} /></span>
              <AnimatedText once text="Trúc Vy" el="h6" />
            </div>
          </div>
        </div>
        <div className={`${prefixSection}-block-2`}>
          <div
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
              <AnimatedText once text="Âu Thanh Thắng" />
              <p>and</p>
              <AnimatedText once text="Cao Thị Trúc Vy" />
            </div>
            <div className={`${prefixSection}-block-element`}>
              <div className={`${prefixSection}-block-text`}>
                <span>09:00</span>
                <span>Chủ nhật</span>
              </div>
              <div className={`${prefixSection}-block-text`}>
                <span>Tháng 06</span>
                <span>02</span>
                <span>(Nhầm ngày 26 tháng 4 năm Giáp Thìn)</span>
              </div>
              <div className={`${prefixSection}-block-text`}>
                <span>20</span>
                <span>24</span>
              </div>
            </div>
            <div className={`${prefixSection}-block-address`}>
              <span>Nhà hàng tiệc cưới <strong>Phương Nhi</strong></span>
              <span>(01 Quang trung - Phú túc - Krông Pa - Gia Lai)</span>
            </div>
            <div className={`${prefixSection}-block-calendar`}>
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
              <h5>BẠN SẼ THAM DỰ CHỨ ?</h5>
              <p>Thật vui vì được gặp và đón tiếp bạn trong một dịp đặc biệt như đám cưới của chúng mình. Đám cưới của chúng mình sẽ trọn vẹn hơn khi có thêm lời chúc phúc và sự hiện diện của các bạn. Xin hãy xác nhận sự có mặt của mình để chúng mình chuẩn bị đón tiếp một cách chu đáo nhất nhé! Trân trọng!</p>
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
                <FormSelect
                  control={control}
                  label="Bạn sẽ tham gia chứ ?"
                  placeholder="Bạn sẽ tham gia chứ ?"
                  name='thinking'
                  options={[
                    { label: "Chắc chắn rồi, mình sẽ đến đám cưới bạn", value: "Chắc chắn rồi, mình sẽ đến đám cưới bạn" },
                    { label: "Không chắc nữa", value: "Không chắc nữa" },
                    { label: "Rất tiếc mình bận rồi", value: "Rất tiếc mình bận rồi" },
                  ]}
                />
              </div>
              <div className={classNames(`${prefixSection}-form-block ${prefixSection}-form-btn`)}>
                <Button className='btn-primary' onClick={handleSubmit(submitForm)}>Phản hồi</Button>
              </div>
            </div>
          </div>
        </div>
        <div className={`${prefixSection}-block-6`}>
          <div className={`${prefixSection}-container`}>
            <div className={`${prefixSection}-block-header`}>
              <h5>♥ Hộp mừng cưới ♥</h5>
              <p>Cảm ơn vì những lời chúc của bạn, chúng mình mong rằng bạn sẽ dành chút thời gian để đến chung vui cùng chúng mình đấy!!!</p>
            </div>
            <div className={`${prefixSection}-block-qrcode`}>
              {/**<div className="qrcode">
                <img src={require('assets/images/pictures/qrcode-1.webp')} alt="Hộp mừng cưới" />
              </div> */}
              <div className="qrcode">
                <img src={require('assets/images/pictures/qrcode-2.webp')} alt="Hộp mừng cưới" />
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
