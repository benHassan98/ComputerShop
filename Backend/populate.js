"use strict";
require("dotenv").config();
const Component = require("./models/component");
const Category = require("./models/category");
const fs = require("fs");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const create_category = async (name, description) => {
  const doc = new Category({
    name,
    description,
  });
  await doc.save();
  return doc;
};

const create_component = async (
  name,
  features,
  manufacturer,
  category,
  price,
  stock,
  image_path
) => {
  const doc = new Component({
    name,
    features,
    manufacturer,
    category: category._id,
    price,
    stock,
    image: {
      data: fs.readFileSync(image_path),
      contentType: "image/jpg",
    },
  });
  await doc.save();
};
(async () => {
 console.log('start');
  const videoCard = await create_category(
    "VideoCard",
    `The video card is an expansion card that allows the computer to send graphical information to a video display device such as a monitor, TV, or projector.`
  );
const videoCardComponent1 = await create_component(`MSI Gaming GeForce RTX 3060 Ti LHR`,`Chipset: NVIDIA GeForce RTX 3060 Ti LHR,
Boost Clock: 1695 MHz,
Video Memory: 10GB GDDR6X,
Memory Interface: 256-bit,
Output: DisplayPort x 3 (v1.4a) / HDMI 2.1 x 1`,'MSI',videoCard,200,20,__dirname+'/images/vc1.jpg');

const videoCardComponent2 = await create_component(`GIGABYTE GeForce GTX 1650`,`Powered by GeForce GTX 1650,
NVIDIA Turing architecture and GeForce Experience,
Integrated with 4GB GDDR6 128bit memory interface,
80mm unique blade fan,
170 mm compact card size`,'NVIDIA',videoCard,300,15,__dirname+'/images/vc2.jpg');
console.log('finished video card');
const cpu = await create_category('CPU','The CPU is the brain of a computer, containing all the circuitry needed to process input, store data, and output results.');
const cpuComponent1 = await create_component('Intel Core i7-12700KF Desktop Processor 12',`Intel® Core® i7 3.60 GHz processor offers more cache space and the hyper-threading architecture delivers high performance for demanding applications with better onboard graphics and faster turbo boost,
The Socket LGA-1700 socket allows processor to be placed on the PCB without soldering,
11 MB L2 and 25 MB L3 cache offers supreme performance for computation intensive apps,
Intel 7 Architecture enables improved performance per watt and micro architecture makes it power-efficient`,'Intel',cpu,400,25,__dirname+'/images/cpu1.jpg');
const cpuComponent2 = await create_component('AMD Ryzen 7 5800X 8-core',`AMD's fastest 8 core processor for mainstream desktop with 16 procesing threads, OS Support-Windows 10 64-Bit Edition,
Can deliver elite 100-plus FPS performance in the world's most popular games,
4.7 GHz Max Boost, unlocked for overclocking, 36 MB of cache, DDR-3200 support,
can support PCIe 4.0 on X570 and B550 motherboards`,'AMD',cpu,600,10,__dirname+'/images/cpu2.jpg');
console.log('finished cpu');
const mb = await create_category('MotherBoard',`The motherboard is a printed circuit board and foundation of a computer that is the biggest board in a computer chassis. It allocates power and allows communication to and between the CPU, RAM, and all other computer hardware components.`);
const mbcomponent1 = await create_component('ASUS ROG Strix B450-F Gaming II AMD AM4',`AMD AM4 Socket: Compatible to Ryzen 5000 3rd/2nd/1st Gen AMD Ryzen CPUs,
Robust Power Design: 8+2 DrMOS power stages with high-quality alloy chokes and durable capacitors provide reliable power for the last AMD high-count-core CPUs,
Optimized Thermal Solution: Extended VRM and PCH heatsinks, M.2 heatsinks, multiple hybrid fan headers and fan speed management with Fan Xpert utility,
Best Gaming Connectivity: Supports HDMI 2.0b(4K@60HZ) and DisplayPort 1.2 output, featuring dual M.2 slots (NVMe SSD), 2x PCIe 3.0x16 Slot, USB 3.2 Gen 2 Type-A port and USB 3.1 Gen 2 Type-A & Type-C ports,
Industry-leading Gaming Audio & AI Noise Canceling Microphone Technology: High fidelity audio from a SupremeFX S1220A codec with DTS Sound Unbound and Sonic Studio III draws you deeper into the action. Communicate clearly with ASUS AI Noise Cancelling Mic technology.,
Unmatched Personalization: ASUS-exclusive Aura Sync RGB lighting with Armoury Crate utility, including 2xRGB headers and a Gen 2 addressable RGB header for greater customization,
DIY Friendly: With BIOS Flashback and ASUS exclusive UEFI BIOS, 256Mb BIOS Flash ROM and Pre-mount I/O shroud`,'ASUS',mb,150,5,__dirname+'/images/mb1.jpg');
const mbcomponent2 = await create_component('MSI MAG X570S Tomahawk WiFi Motherboard',`Supports AMD Ryzen 5000 Series, 5000 G-Series, 4000 G-Series, 3000 Series, 3000 G-Series, 2000 Series and 2000 G-Series desktop processors,
Supports DDR4 Memory, up to 5100(OC) MHz,
Premium Thermal Solution: Extended Heatsink Design and M.2 Shield Frozr are built for high performance system and non-stop works,
2.5G LAN and Intel Wi-Fi 6E Solution: Upgraded network solution for professional and multimedia use. Delivers a secure, stable and fast network connection,
Lightning M.2: Running at PCIe Gen4 x4 maximizes performance for NVMe based SSDs`,'MSI',mb,300,6,__dirname+'/images/mb2.jpg');

console.log('finished motherboard');

const memory = await create_category('Memory','memory is a device or system that is used to store information for immediate use in a computer');
const memcomp1 = await create_component('Crucial RAM 32GB Kit (2x16GB) DDR4 3200MHz CL22 (or 2933MHz or 2666MHz) Desktop Memory CT2K16G4DFRA32A',`3200MHz RAM can downclock to 2933MHz or 2666MHz if system specification only supports 2933MHz or 2666MHz,
Improve your system's responsiveness, run apps faster and multitask with ease,
Compatibility assurance when using the Crucial System Scanner or Crucial Advisor Tool,
Micron quality and reliability is backed by superior component and module level testing and 42 years of memory expertise,
ECC Type = Non-ECC, Form Factor = UDIMM, Pin Count = 288-pin, PC Speed = PC4-25600, Voltage = 1.2V, Rank and Configuration = 1Rx8 or 2Rx8`,'Crucial',memory,120,20,__dirname+'/images/mem1.jpg');
const memcomp2 = await create_component('G.Skill Ripjaws V Series 64GB (2 x 32GB) 288-Pin SDRAM DDR4 3200 (PC4-25600) CL16-18-18-38 1.35V Dual Channel Desktop Memory Model F4-3200C16D-64GVK',`RipJaws V Series, designed specifically for AMD Ryzen X570 Series; Intel Z390, Z490, Z590, Z690 and newer.,
64GB kit containing 2 x 32GB modules, DDR4-3200, 288-Pin, CAS Latency CL16 (16-18-18-38) at 1.35V,
Brand: G.SKILL, Series: RipJaws V, Model: F4-3200C16D-32GVK,
ECC: No, Dual Channel Kit, Recommended Use: High Performance or Gaming Memory,
XMP 2.0 profile support to reach up to the rated overclock speed, or run at default JEDEC profile speed.,
Rated XMP frequency & stability depends on MB & CPU capability`,'G.Skill',memory,210,30,__dirname+'/images/mem2.jpg');
console.log('finished memory');

const computercase = await create_category('Case','Computer Case is the enclosure that contains most of the components of a personal computer ');
const casecomp1 = await create_component('MUSETEX Mid-Tower ATX PC Case with 6pcs 120mm ARGB Fans, Mesh Computer Gaming Case, Opening Tempered Glass Side Panels, USB 3.0 x 2, Black, TW8-S6-B',`Ultimate Thermal Performance - The computer case with tempered glass side panel possessing magnetic buckle and metal pull ring is easy to install the hardware, and can be opened at any time, improving the ultimate thermal effect, which improves 76% of the cooling effect than the non-opening panel case.,
6 Pre-Installed 120mm ARGB Fans - Suitable for enhanced cooling. With the pre-installed ARGB controller you can sync it with the motherboard, each addressable ARGB fan offers 16.8 million colors for exceptional customizable lighting. You don't need to pay extra for fans. Only when the 5V3PIN cable on the control board is connected to the motherboard can the ARGB light synchronization be realized. (Note: 12V 4PIN motherboard is not suitable for motherboard control, Button control is recommended.),
Powerful I/O Panel - TW8's I/O panel includes 2 USB 3.0 ports for faster transfer speed. At the same time, there are exclusive LED buttons to freely control your ARGB color light.,
Clean Design - Large front mesh front panel for optimal cooling performance, and the high light-transmitting glass side panels show off your computer's ARGB lighting.,
More Storage Space - The mid tower pc case provides multiple hard drive fixed slots, supporting to install 4*SSD + 2*HDD or 5*SSD + 1*HDD.,
Compatible with Different Radiator - The top of the pc case is designed to fit 240mm / 280mm radiators. After installing the Radiator, the original 2 fans at the top can be installed at the above the power supply compartment to achieve more powerful cooling effect. And the radiator can be connected to the ARGB controller through 5V 3PIN to achieve 6 fans sync color.,
The Best Choice - MUSETEX TW8 has 6 ARGB fans supporting external expansion ARGB controller, and is equipped with superior magnetic tempered glass side doors. It is the best choice for you to create a high-end gaming desktop.`,'MUSETEX',computercase,120,30,__dirname+'/images/case1.jpg');
const casecomp2 = await create_component('Corsair 4000D Airflow Tempered Glass Mid-Tower ATX PC Case - Black',`Combining innovative cable management, concentrated airflow, and proven CORSAIR build quality, the 4000D is a fitting choice for an immaculate high-performance PC.,
The CORSAIR RapidRoute cable management system makes it simple and fast to route your major cables through a single channel, with a roomy 25mm of space behind the motherboard for all of your cables.,
Includes two CORSAIR 120mm AirGuide fans, utilizing anti-vortex vanes to concentrate airflow and enhance cooling.,
A spacious interior fits up to 6x 120mm or 4x 140mm cooling fans, along with multiple radiators including 360mm in front and 280mm in the roof (dependent on RAM height).,
Put modern connections within easy reach with a front I/O panel including a USB 3.1 Type-C Port, USB 3.0 port, and a combination audio/microphone jack.`,'Corsair',computercase,100,5,__dirname+'/images/case2.jpg');
console.log('finished computer case');

const cpucooler = await create_category('CPU Cooler','A CPU cooler is device designed to draw heat away from the system CPU and other components in the computer.');
const coolcomp1 = await create_component('Corsair iCUE H100i Elite Capellix Liquid CPU Cooler',`A high-performance RGB pump head provides powerful, low-noise cooling for your CPU, lit by 33 ultra-bright CAPELLIX RGB LEDs.,
Includes a CORSAIR iCUE Commander CORE Smart RGB Lighting and Fan Speed Controller, for precise speed and lighting control over up to six RGB fans.,
Two 120mm CORSAIR ML RGB Magnetic Levitation PWM fans deliver powerful airflow for extreme CPU cooling performance, with eight RGB LEDs per fan.,
Accurately control your cooling via PWM, adjusting fan speeds from 400 to 2,400 RPM.,
Zero RPM fan profiles in CORSAIR iCUE software allow fans to stop entirely at low temperatures, eliminating fan noise.,
Compatible Sockets: Intel LGA 1150, 1151, 1155, 1156, 1200, 1366, 2011, 2011-3, 2066 and AMD AM2, AM3, AM4, FM1, FM2, sTR4, sTRX4,
Compatible with the new Intel LGA1700 with purchase of CW-8960091 or CW-8960093 spare parts`,'Corsair',cpucooler,135,15,__dirname+'/images/cool1.jpg');
const coolcomp2 = await create_component('Pure Rock 2 Black (BK007), 150W TDP, CPU Cooler, Intel-1700/1200/2066/1150/1151/1155/2011(-3) Square ILM, AMD-AM4',`A high 150W TDP cooling efficiency,
Four high-performance 6mm heat pipes with HDT technology,
Asymmetrical construction avoids blocking memory slots,
Pure Wings 2 120mm PWM fan for silent operation of max. 26. 8 dB(A),
Elegant black surface.Easily installable installation kit can be mounted from atop the motherboard.Three-year manufacturer's`,'Intel',cpucooler,45,30,__dirname+'/images/cool2.jpg');
console.log('finished cpu cooler');

console.log('finished');
process.exit(0);
})();
