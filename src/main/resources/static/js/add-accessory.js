console.log("ADD-ACCESSORY.JS ĐÃ CHẠY");

const API_BASE_URL = "http://localhost:8080/api/accessories";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("addAccessoryForm")
        .addEventListener("submit", submitForm);
});

async function submitForm(e) {
    e.preventDefault();
    console.log("ĐÃ NHẬN SUBMIT FORM THÊM PHỤ KIỆN");

    const payload = {
        name: document.getElementById("name").value.trim(),
        type: document.getElementById("type").value.trim(),
        price: Number(document.getElementById("price").value),
        brand: document.getElementById("brand").value.trim(),
        material: document.getElementById("material").value.trim(),
        size: document.getElementById("size").value.trim(),
        description: document.getElementById("description").value.trim(),
        imageUrl: document.getElementById("imageUrl").value.trim(),
        stock: Number(document.getElementById("stock").value)
    };

    // ============================
    // VALIDATE
    // ============================
    if (payload.name.length < 2) {
        showToast("❌ Tên phụ kiện quá ngắn", "error");
        return;
    }
    if (payload.type.length < 2) {
        showToast("❌ Loại phụ kiện quá ngắn", "error");
        return;
    }
    if (payload.price <= 0) {
        showToast("❌ Giá phải > 0", "error");
        return;
    }
    if (payload.brand.length < 2) {
        showToast("❌ Thương hiệu quá ngắn", "error");
        return;
    }
    if (payload.material.length < 2) {
        showToast("❌ Chất liệu quá ngắn", "error");
        return;
    }
    if (payload.size.length < 1) {
        showToast("❌ Kích thước không được trống", "error");
        return;
    }
    if (payload.stock < 0) {
        showToast("❌ Tồn kho không hợp lệ", "error");
        return;
    }
    if (payload.description.length < 5) {
        showToast("❌ Mô tả quá ngắn", "error");
        return;
    }

    try {
        const res = await fetch(API_BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json();
            showToast("❌ " + (err.errorMessage || "Lỗi không xác định"), "error");
            return;
        }

        console.log("DỮ LIỆU LƯU:", await res.clone().json());
        showToast("✔ Thêm phụ kiện thành công!", "success");

        setTimeout(() => {
            window.location.href = "accessories-admin.html";
        }, 900);

    } catch (error) {
        console.error(error);
        showToast("⚠ Không thể kết nối server!", "error");
    }
}
