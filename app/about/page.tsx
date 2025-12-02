export default function AboutPage() {
  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-900">
            Về chúng tôi
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            Chào mừng bạn đến với Handmade Store - nơi tình yêu thủ công gặp gỡ
            nghệ thuật
          </p>
        </div>

        <div className="prose prose-lg mx-auto max-w-none">
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Câu chuyện của chúng tôi
            </h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Handmade Store được thành lập với niềm đam mê về những sản phẩm
              được làm thủ công bằng tình yêu và sự tận tâm. Chúng tôi tin rằng
              mỗi sản phẩm handmade đều mang trong mình một câu chuyện, một phần
              tâm hồn của người thợ thủ công.
            </p>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Từ những chiếc túi vải đơn giản đến những món đồ trang trí tinh
              xảo, mỗi sản phẩm của chúng tôi đều được chọn lọc kỹ lưỡng để đảm
              bảo chất lượng và tính độc đáo.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Giá trị của chúng tôi
            </h2>
            <ul className="list-disc space-y-2 pl-6 text-gray-700">
              <li>
                <strong>Chất lượng:</strong> Chúng tôi chỉ bán những sản phẩm
                đạt tiêu chuẩn chất lượng cao
              </li>
              <li>
                <strong>Độc đáo:</strong> Mỗi sản phẩm đều là duy nhất và mang
                dấu ấn riêng
              </li>
              <li>
                <strong>Thân thiện môi trường:</strong> Ưu tiên sử dụng nguyên
                liệu tự nhiên và bền vững
              </li>
              <li>
                <strong>Tận tâm:</strong> Chăm sóc khách hàng với sự tận tâm và
                chu đáo
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Liên hệ với chúng tôi
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Nếu bạn có bất kỳ câu hỏi nào hoặc muốn tìm hiểu thêm về sản phẩm
              của chúng tôi, đừng ngần ngại liên hệ với chúng tôi. Chúng tôi
              luôn sẵn sàng hỗ trợ bạn!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
