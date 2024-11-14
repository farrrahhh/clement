function loadMaterial(materialId) {
    const contentId = `content${materialId.charAt(materialId.length - 1)}`;
    const material = document.getElementById(materialId).value;
    const contentDiv = document.getElementById(contentId);

    let content = '';
    switch (material) {
        case 'material1-1':
            content = 'Kata baku adalah kata yang penulisannya sesuai dengan kaidah atau aturan dalam bahasa yang telah ditetapkan oleh otoritas bahasa, dalam hal ini Kamus Besar Bahasa Indonesia (KBBI). Kata baku umumnya digunakan dalam situasi resmi, seperti dalam tulisan ilmiah, surat resmi, pidato formal, dan media massa. Ciri-ciri kata baku: Mengikuti ejaan yang disempurnakan (EYD), Tidak terpengaruh oleh bahasa asing atau bahasa daerah, Digunakan dalam situasi formal, Bersumber dari KBBI';
            break;
        case 'material1-2':
            content = 'Kata tidak baku adalah kata yang tidak sesuai dengan aturan bahasa yang berlaku. Kata-kata ini sering digunakan dalam percakapan sehari-hari atau situasi informal. Ciri-ciri kata tidak baku: Tidak mengikuti ejaan yang disempurnakan, Sering dipengaruhi oleh bahasa daerah atau bahasa asing, Digunakan dalam percakapan non-formal, tidak terdapat dalam KBBI sebagai kata yang benar.';
            break;
        case 'material2-1':
            content = 'Ejaan adalah cara atau aturan dalam penulisan kata-kata dari suatu bahasa, termasuk cara menuliskan huruf, kata, frasa, tanda baca, serta penggunaan huruf kapital. Dalam bahasa Indonesia, aturan ejaan yang berlaku adalah Ejaan yang Disempurnakan (EYD), yang sekarang dikenal sebagai Pedoman Umum Ejaan Bahasa Indonesia (PUEBI). Fungsi ejaan antara lain: Menjaga konsistensi penulisan, Mempermudah pemahaman dan komunikasi, Menghindari kesalahpahaman dalam bahasa tulis.';
            break;
        case 'material3-1':
            content = 'Penulisan kata dalam bahasa Indonesia diatur berdasarkan jenis kata, seperti kata dasar, kata ulang, kata majemuk, serta kata dengan imbuhan, dan juga penulisan kata serapan. Penggunaan huruf dan penulisan kata ini penting untuk menjaga konsistensi, ketepatan, dan kejelasan dalam komunikasi tertulis sesuai dengan standar bahasa Indonesia yang benar.';
            break;
        default:
            content = '';
    }

    contentDiv.innerHTML = content;
}