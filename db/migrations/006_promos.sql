-- Create Promos Table
CREATE TABLE IF NOT EXISTS promos (
    id VARCHAR(100) PRIMARY KEY,
    badge VARCHAR(255),
    badge_color VARCHAR(100),
    icon VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    bullets TEXT[],
    display_price VARCHAR(100) NOT NULL,
    numeric_price NUMERIC(12, 2) NOT NULL,
    strike_price VARCHAR(100),
    strike_price_line_through BOOLEAN DEFAULT true,
    discount_label VARCHAR(100),
    discount_percent INTEGER,
    valid_till TIMESTAMPTZ,
    used_count VARCHAR(100),
    used_count_value INTEGER DEFAULT 0,
    image TEXT,
    image_class_name TEXT,
    card_tint TEXT,
    bg_color VARCHAR(100),
    image_glow TEXT,
    accent VARCHAR(100),
    categories TEXT[],
    is_combo BOOLEAN DEFAULT false,
    relevance INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Garage Owner user
INSERT INTO users (id, mobile_number, name, status)
VALUES ('00000000-0000-0000-0000-000000000003', '9999999999', 'Garage Owner', 'active')
ON CONFLICT (mobile_number) DO NOTHING;

-- Seed user role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.mobile_number = '9999999999' AND r.code = 'garage'
ON CONFLICT DO NOTHING;

-- Seed Garages
INSERT INTO garages (id, owner_user_id, name, address, location, specializations, certifications, pickup_drop_supported, approval_status, rating_avg, rating_count)
VALUES 
('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000003', 'QuickPit Service Center', 'Madhapur, Hyderabad', '{"lat": 17.4483, "lng": 78.3741}', ARRAY['engine', 'brakes', 'Inspection', 'Pickup'], ARRAY['ISO 9001'], true, 'approved', 4.5, 96),
('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000003', 'SpeedFix Auto Care', 'Kondapur, Hyderabad', '{"lat": 17.4622, "lng": 78.3568}', ARRAY['engine', 'brakes', 'Warranty', 'Parts'], ARRAY['ASE Certified'], true, 'approved', 4.6, 128),
('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000003', 'AutoWorks Garage', 'Gachibowli, Hyderabad', '{"lat": 17.4401, "lng": 78.3489}', ARRAY['engine', 'brakes', 'Inspection'], ARRAY['Bosch Certified'], false, 'approved', 4.4, 110),
('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000003', 'Five Star Automotive', 'Banjara Hills, Hyderabad', '{"lat": 17.4156, "lng": 78.4347}', ARRAY['engine', 'EV', 'Warranty'], ARRAY['Manufacturer Approved'], true, 'approved', 4.3, 78),
('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000003', 'Metro Auto Bay', 'Hitech City, Hyderabad', '{"lat": 17.4435, "lng": 78.3772}', ARRAY['engine', 'brakes', 'Parts'], ARRAY['ISO 9001'], true, 'approved', 4.7, 142),
('00000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000003', 'Royal Motor Service', 'Jubilee Hills, Hyderabad', '{"lat": 17.4312, "lng": 78.4008}', ARRAY['engine', 'Inspection'], ARRAY['ASE Certified'], false, 'approved', 4.2, 64),
('00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000003', 'PitStop Car Care', 'Kukatpally, Hyderabad', '{"lat": 17.4948, "lng": 78.3996}', ARRAY['brakes', 'Parts'], ARRAY['Bosch Certified'], true, 'approved', 4.1, 58)
ON CONFLICT (id) DO NOTHING;

-- Seed Promos
INSERT INTO promos (id, badge, badge_color, icon, title, bullets, display_price, numeric_price, strike_price, strike_price_line_through, discount_label, discount_percent, valid_till, used_count, used_count_value, image, image_class_name, card_tint, bg_color, image_glow, accent, categories, is_combo, relevance)
VALUES
('summer-care-combo', 'SUMMER CARE COMBO', 'text-[#ff7a00]', 'Sun', 'Coolant + AC + Engine Oil Combo', ARRAY['Improves engine cooling', 'Enhances AC performance', 'Extends engine life'], '₹2,999', 2999, '₹4,500', true, '33% OFF', 33, NOW() + INTERVAL '30 days', '1.2K times', 1200, '/assets/summner_car.png', 'h-[148px] w-[178px] object-contain', 'from-[#fffaf0] via-[#fffaf5] to-[#fff4e7]', '#fff7ed', 'bg-[radial-gradient(circle_at_75%_45%,rgba(255,160,64,0.28),transparent_36%)]', 'text-[#f04f23]', ARRAY['Car Care', 'Service', 'Combo Deals'], true, 99),
('monsoon-care-combo', 'MONSOON CARE COMBO', 'text-[#1c9b6e]', 'CloudRain', 'Wiper Blades + Tyres + Checkup Combo', ARRAY['Clear visibility in rain', 'Better grip on wet roads', 'Comprehensive vehicle check'], '₹1,999', 1999, '₹3,000', true, '33% OFF', 33, NOW() + INTERVAL '45 days', '986 times', 986, '/assets/monsooncare.png', 'h-[150px] w-[182px] object-cover rounded-[20px]', 'from-[#f3fffb] via-[#f7fffd] to-[#eef8ff]', '#f0fdf4', 'bg-[radial-gradient(circle_at_72%_42%,rgba(80,178,202,0.26),transparent_38%)]', 'text-[#178e56]', ARRAY['Service', 'Tyres', 'Combo Deals'], true, 97),
('winter-care-combo', 'WINTER CARE COMBO', 'text-[#2454f6]', 'Snowflake', 'Battery + Engine Oil + Coolant Combo', ARRAY['Reliable cold starts', 'Smooth engine performance', 'Prevents overheating'], '₹2,499', 2499, '₹3,800', true, '34% OFF', 34, NOW() + INTERVAL '60 days', '642 times', 642, '/assets/wintercombo.png', 'h-[148px] w-[178px] object-contain', 'from-[#f5f8ff] via-[#fafbfe] to-[#f0f4ff]', '#eff6ff', 'bg-[radial-gradient(circle_at_75%_45%,rgba(36,84,246,0.18),transparent_36%)]', 'text-[#2454f6]', ARRAY['Batteries', 'Service', 'Combo Deals'], true, 95),
('festival-shine-combo', 'festival-shine-combo', 'text-[#805ad5]', 'Sparkles', 'Foam Wash + Wax + Interior Dressing', ARRAY['Showroom shine', 'Protects paint', 'Deep clean interior'], '₹1,799', 1799, '₹2,600', true, '31% OFF', 31, NOW() + INTERVAL '15 days', '852 times', 852, 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=400&q=80', 'h-[148px] w-[178px] object-cover rounded-[20px]', 'from-[#faf5ff] to-[#f3ebff]', '#faf5ff', '', 'text-[#805ad5]', ARRAY['Car Care', 'Combo Deals'], true, 90),
('weekend-check-combo', 'WEEKEND CHECK COMBO', 'text-[#2f855a]', 'Settings', 'Brake Check + Battery Test + Fluid Top-up', ARRAY['Safety first', 'Peace of mind', 'Quick 30-min service'], '₹1,499', 1499, '₹2,200', true, '32% OFF', 32, NOW() + INTERVAL '10 days', '431 times', 431, '/assets/weekend_combo_1778071208387.png', 'h-[148px] w-[178px] object-contain', 'from-[#f0fff4] to-[#e6ffe6]', '#f0fff4', '', 'text-[#2f855a]', ARRAY['Service', 'Combo Deals'], true, 85),
('mega-car-wash-offer', 'MEGA CAR WASH OFFER', 'text-[#238453]', 'CarFront', 'Premium Wash + Interior Cleaning', ARRAY['Exterior foam wash', 'Vacuum cleaning', 'Dashboard polish'], '₹499', 499, '₹699', true, '29% OFF', 29, NOW() + INTERVAL '20 days', '2.1K times', 2100, '/assets/mega car.png', 'h-12 w-12', 'from-[#edf9ef] to-[#f8fbff]', '#edf9ef', '', 'text-[#238453]', ARRAY['Car Care'], false, 98),
('brake-care-special', 'BRAKE CARE SPECIAL', 'text-[#ff3b30]', 'Disc3', 'Brake Pads + Disc Inspection', ARRAY['Brake wear check', 'Pads replacement option', 'Noise issue diagnosis'], '₹1,299', 1299, '₹1,799', true, '28% OFF', 28, NOW() + INTERVAL '25 days', '1.5K times', 1500, '/assets/brake_disc_1778070670609.png', 'h-12 w-12', 'from-[#fff2f2] to-[#fff8f8]', '#fff2f2', '', 'text-[#ff3b30]', ARRAY['Service'], false, 96),
('ac-service-offer', 'AC SERVICE OFFER', 'text-[#1a56db]', 'Snowflake', 'AC Checkup + Gas Top-up', ARRAY['Cooling effectiveness check', 'Filter cleaning', 'Gas level top-up'], '₹1,199', 1199, '₹1,599', true, '26% OFF', 26, NOW() + INTERVAL '30 days', '1.8K times', 1800, '/assets/ac_vent_1778070688367.png', 'h-12 w-12', 'from-[#eff5ff] to-[#fafcff]', '#eff5ff', '', 'text-[#1a56db]', ARRAY['Service'], false, 94)
ON CONFLICT (id) DO NOTHING;
