-- 로컬 개발용 샘플 데이터 (디자인 시안의 데모 매물)
INSERT INTO categories (name, icon, count, sort_order) VALUES
  ('Суудлын', 'directions_car', 4, 1),
  ('Жийп / SUV', 'airport_shuttle', 2, 2),
  ('Хайбрид', 'bolt', 1, 3),
  ('Цахилгаан', 'ev_station', 0, 4);

INSERT INTO products (name, price, priceKRW, year, mileage, fuel, description, categoryId, status, images, options, isFeatured, engine, transmission, drive, color, doors) VALUES
  ('Hyundai Sonata LF 2.0', '₮33,600,000', 13200000, '2017', '15,000км', 'Petrol', 'Ослын түүхгүй, нэг эзэмшигчтэй. 200 цэгийн үзлэгээр бүрэн шалгагдсан бөгөөд бүх зарцуулах материалыг шинэчилсэн. Гаалийн бүрдүүлэлт, тээвэр, улсын бүртгэлийн ажиллагааг DT Trading бүрэн хариуцна.', 1, 'active', '[]', '["sunroof","led_headlight","alloy_wheels","heated_steering","abs","esc","rear_camera","parking_sensor","cruise_control","auto_ac","smart_key","navigation","bluetooth","leather_seat","power_seat_front","heated_seat_front"]', 1, '1,998cc', 'Автомат', 'Урдаа татдаг', 'Цагаан', '4'),
  ('Audi A3 (8Y) 40 TFSI Premium', '₮67,600,000', 26600000, '2023', '51,000км', 'Petrol', 'Eye шалгасан. Ослын түүхгүй.', 1, 'active', '[]', '["led_headlight","alloy_wheels","paddle_shift","abs","esc","rear_camera","camera_360","cruise_control","auto_ac","smart_key","navigation","bluetooth","leather_seat","heated_seat_front","vent_seat_front"]', 1, '1,984cc', 'Автомат', 'Урдаа татдаг', 'Хар', '4'),
  ('Genesis DH G330 Modern', '₮37,100,000', 14600000, '2016', '67,000км', 'Petrol', '1 жил баталгаатай.', 1, 'active', '[]', '["sunroof","led_headlight","alloy_wheels","abs","esc","rear_camera","cruise_control","auto_ac","smart_key","navigation","bluetooth","leather_seat","memory_seat"]', 0, '3,342cc', 'Автомат', 'Хойноо татдаг', 'Саарал', '4'),
  ('Kia Sorento MQ4 HEV 1.6 2WD', '₮75,400,000', 29700000, '2021', '74,000км', 'Hybrid', 'Eye шалгасан. Ослын түүхгүй.', 2, 'active', '[]', '["led_headlight","alloy_wheels","roof_rail","abs","esc","rear_camera","camera_360","ldws","cruise_control","hud","auto_ac","smart_key","navigation","bluetooth","leather_seat","heated_seat_front","vent_seat_front"]', 1, '1,598cc', 'Автомат', 'Урдаа татдаг', 'Цагаан', '5'),
  ('Ford Explorer 6 2.3 Limited 4WD', '₮57,900,000', 22800000, '2020', '119,000км', 'Petrol', '1 жил баталгаатай.', 2, 'active', '[]', '["sunroof","led_headlight","alloy_wheels","roof_rail","abs","esc","rear_camera","parking_sensor","cruise_control","auto_ac","smart_key","navigation","bluetooth","leather_seat","power_seat_front"]', 0, '2,261cc', 'Автомат', 'Бүх дугуй', 'Хөх', '5'),
  ('Hyundai Casper 1.0 Turbo', '₮44,700,000', 17600000, '2024', '11,000км', 'Petrol', 'Eye шалгасан. Ослын түүхгүй.', 1, 'active', '[]', '["led_headlight","abs","esc","rear_camera","cruise_control","auto_ac","smart_key","bluetooth","heated_seat_front"]', 0, '998cc', 'Автомат', 'Урдаа татдаг', 'Шар', '5'),
  ('Kia All New Morning Deluxe', '₮13,200,000', 5200000, '2013', '49,000км', 'Petrol', '1 жил баталгаатай.', 1, 'active', '[]', '["abs","rear_camera","auto_ac","bluetooth"]', 0, '998cc', 'Автомат', 'Урдаа татдаг', 'Цагаан', '5'),
  ('Toyota Prius 1.8 Hybrid', '₮28,400,000', 11200000, '2018', '88,000км', 'Hybrid', 'Ослын түүхгүй.', 3, 'active', '[]', '["led_headlight","abs","esc","rear_camera","cruise_control","auto_ac","smart_key","bluetooth"]', 0, '1,798cc', 'Автомат', 'Урдаа татдаг', 'Мөнгөлөг', '4');

INSERT INTO banners (title, subtitle, image, active) VALUES
  ('Солонгосоос шууд,
шалгагдсан автомашин', 'Гааль, тээвэр, бүртгэл — бүгд багцад.', '', 1);
