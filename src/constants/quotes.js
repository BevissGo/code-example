import { uppercaseFirstText } from 'utils'
import { homePageImg } from './images'

const { listAvatarQuote } = homePageImg

const listName = ['alan', 'lina', 'max', 'stella']
const listAvatar = {}
listName.forEach((name) => {
  listAvatar['avatar' + uppercaseFirstText(name)] = listAvatarQuote[name]['src']
})

const quotes = {
  listQuote: [
    {
      content:
        'Bài đánh giá DiSC thật sự chính xác. Ngoài ra, DiSC còn giúp tôi hoàn thiện những phần còn thiếu trong tính cách mình. Từ khi biết đến DiSC, cuộc đời tôi như sang trang mới.',
      avatar: listAvatar.avatarMax,
      name: 'Max Vũ',
      age: 32,
      behavior: 'CD',
      job: 'trưởng phòng kinh doanh',
    },
    {
      content:
        'DiSC không chỉ là một bài đánh giá bình thường, mà còn giúp mình xác định được những điểm mạnh, điểm yếu cũng như con đường phù hợp với bản thân.',
      avatar: listAvatar.avatarStella,
      name: 'Stella Nguyễn',
      age: 22,
      behavior: 'SC',
      job: 'nhân viên văn phòng',
    },
    {
      content:
        'Đã có những thời điểm tôi bơ vơ và lạc lõng vì không tìm được hướng đi cho cuộc đời mình. Cảm ơn bài đánh giá DiSC đã giúp tôi trả lời câu hỏi ấy.',
      avatar: listAvatar.avatarAlan,
      name: 'Alan Trần',
      age: 27,
      behavior: 'DS',
      job: 'kỹ sư xây dựng',
    },
    {
      content:
        'DiSC không chỉ là một công cụ để các bạn trẻ tìm hiểu tính cách, mà còn là phương thức để các doanh nghiệp tìm được ứng cử viên phù hợp mà họ đang tìm kiếm.',
      avatar: listAvatar.avatarLina,
      name: 'Lina Đoàn',
      age: 28,
      behavior: 'IS',
      job: 'quản lý nhân sự',
    },
  ],
}

export default quotes
