import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, FileText } from 'lucide-react'

function LegalPage({ title, icon: Icon, lastUpdated, sections }) {
  const navigate = useNavigate()
  return (
    <div className="bg-app min-h-screen px-4 py-10">
      <div className="max-w-sm mx-auto">
        <button onClick={() => navigate(-1)} className="text-white/50 hover:text-white mb-8 flex items-center gap-2">
          <ArrowLeft size={20} /> Quay lại
        </button>
        <div className="mb-8">
          <div className="w-12 h-12 rounded-xl bg-pink-400/20 flex items-center justify-center mb-4">
            <Icon size={24} className="text-pink-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-white/30 text-xs mt-1">Cập nhật lần cuối: {lastUpdated}</p>
        </div>
        <div className="space-y-6">
          {sections.map((s, i) => (
            <div key={i} className="glass rounded-2xl p-5">
              <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="text-pink-400 font-bold">{i + 1}.</span> {s.title}
              </h2>
              <p className="text-white/50 text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-white/25 text-xs">© {new Date().getFullYear()} Thazh Music. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

const TERMS_SECTIONS = [
  {
    title: 'Chấp nhận điều khoản',
    content: 'Bằng cách sử dụng Thazh Music, bạn đồng ý tuân thủ các điều khoản này. Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ của chúng tôi.',
  },
  {
    title: 'Tài khoản người dùng',
    content: 'Bạn phải đăng ký tài khoản để sử dụng đầy đủ dịch vụ. Bạn chịu trách nhiệm duy trì bảo mật tài khoản và mật khẩu của mình. Mỗi người chỉ được tạo một tài khoản.',
  },
  {
    title: 'Tài khoản Artist',
    content: 'Tài khoản Artist cho phép tải lên nhạc và M/V. Nghệ sĩ phải đảm bảo có đầy đủ quyền sở hữu hoặc giấy phép đối với nội dung tải lên. Vi phạm bản quyền có thể dẫn đến xóa nội dung và đình chỉ tài khoản.',
  },
  {
    title: 'Nội dung bị cấm',
    content: 'Nghiêm cấm đăng nội dung vi phạm bản quyền, nội dung khiêu dâm, nội dung bạo lực, kỳ thị, hoặc vi phạm pháp luật Việt Nam. Thazh có quyền xóa bất kỳ nội dung nào vi phạm quy định.',
  },
  {
    title: 'Kiểm duyệt nội dung',
    content: 'Tất cả nội dung được tải lên sẽ được kiểm duyệt trước khi xuất hiện công khai. Chúng tôi có quyền từ chối hoặc xóa bất kỳ nội dung nào không phù hợp mà không cần giải thích.',
  },
  {
    title: 'Xác minh Artist (Tick hồng)',
    content: 'Nghệ sĩ có thể đăng ký xác minh chính thức. Chúng tôi sẽ xem xét hồ sơ trong 3-5 ngày làm việc. Chúng tôi có quyền từ chối hoặc thu hồi xác minh bất kỳ lúc nào nếu phát hiện vi phạm.',
  },
  {
    title: 'Quyền sở hữu trí tuệ',
    content: 'Bằng cách tải nội dung lên Thazh, bạn cấp cho chúng tôi giấy phép không độc quyền để hiển thị, phân phối và quảng bá nội dung đó trên nền tảng. Bạn vẫn giữ quyền sở hữu của mình.',
  },
  {
    title: 'Chấm dứt dịch vụ',
    content: 'Chúng tôi có thể đình chỉ hoặc xóa tài khoản của bạn nếu vi phạm điều khoản này. Bạn cũng có thể xóa tài khoản bất kỳ lúc nào bằng cách liên hệ với chúng tôi.',
  },
]

const PRIVACY_SECTIONS = [
  {
    title: 'Thông tin chúng tôi thu thập',
    content: 'Chúng tôi thu thập thông tin bạn cung cấp khi đăng ký (tên, email), thông tin sử dụng dịch vụ (bài hát nghe, thời gian sử dụng), và dữ liệu kỹ thuật (thiết bị, trình duyệt, địa chỉ IP).',
  },
  {
    title: 'Cách chúng tôi sử dụng thông tin',
    content: 'Thông tin được dùng để cung cấp và cải thiện dịch vụ, cá nhân hóa trải nghiệm, gửi thông báo quan trọng, và phân tích xu hướng sử dụng để phát triển sản phẩm.',
  },
  {
    title: 'Chia sẻ thông tin',
    content: 'Chúng tôi không bán thông tin cá nhân của bạn cho bên thứ ba. Thông tin chỉ được chia sẻ với đối tác dịch vụ (như Cloudinary để lưu trữ media) và khi pháp luật yêu cầu.',
  },
  {
    title: 'Bảo mật dữ liệu',
    content: 'Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn ngành bao gồm mã hóa SSL/TLS, băm mật khẩu an toàn, và kiểm soát truy cập. Tuy nhiên, không có hệ thống nào hoàn toàn an toàn.',
  },
  {
    title: 'Cookie và theo dõi',
    content: 'Chúng tôi sử dụng cookie và localStorage để lưu thông tin đăng nhập và tùy chọn của bạn. Bạn có thể tắt cookie nhưng điều này có thể ảnh hưởng đến trải nghiệm sử dụng.',
  },
  {
    title: 'Quyền của bạn',
    content: 'Bạn có quyền truy cập, chỉnh sửa, và xóa thông tin cá nhân của mình. Để yêu cầu xóa tài khoản hoặc dữ liệu, hãy liên hệ với chúng tôi qua email support@thazh.com.',
  },
  {
    title: 'Thay đổi chính sách',
    content: 'Chúng tôi có thể cập nhật chính sách này. Khi có thay đổi quan trọng, chúng tôi sẽ thông báo qua email hoặc thông báo trong ứng dụng. Tiếp tục sử dụng dịch vụ sau thay đổi nghĩa là bạn chấp nhận chính sách mới.',
  },
  {
    title: 'Liên hệ',
    content: 'Nếu có câu hỏi về chính sách bảo mật, hãy liên hệ: support@thazh.com hoặc theo địa chỉ công ty ghi trên website.',
  },
]

export function TermsPage() {
  return (
    <LegalPage
      title="Điều khoản dịch vụ"
      icon={FileText}
      lastUpdated="01/01/2025"
      sections={TERMS_SECTIONS}
    />
  )
}

export function PrivacyPage() {
  return (
    <LegalPage
      title="Chính sách bảo mật"
      icon={Shield}
      lastUpdated="01/01/2025"
      sections={PRIVACY_SECTIONS}
    />
  )
}
