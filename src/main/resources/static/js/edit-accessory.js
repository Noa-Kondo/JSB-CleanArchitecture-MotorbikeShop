console.log("EDIT-ACCESSORY.JS LOADED");

const API_BASE_URL = "http://localhost:8080/api/accessories";

document.addEventListener("DOMContentLoaded", () => {

    // Lấy id từ ?id=...
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        showToast("❌ Thiếu id phụ kiện cần sửa", "error");
        return;
    }

    // Load thông tin phụ kiện
    loadAccessory(id);

    // Lắng nghe submit form
    document.getElementById("editAccessoryForm")
        .addEventListener("submit", (e) => submitForm(e, id));
});


/* ---------------------------
   LOAD ACCESSORY FOR EDIT
----------------------------*/
async function loadAccessory(id) {
    try {
        const res = await fetch(API_BASE_URL);
        const data = await res.json();

        const accessory = data.find(a => String(a.id) === String(id));

        if (!accessory) {
            showToast("❌ Không tìm thấy phụ kiện với mã " + id, "error");
            return;
        }

        // Đổ dữ liệu vào form
        document.getElementById("name").value = accessory.name || "";
        document.getElementById("type").value = accessory.type || "";
        document.getElementById("price").value = accessory.price || 0;
        document.getElementById("brand").value = accessory.brand || "";
        document.getElementById("material").value = accessory.material || "";
        document.getElementById("size").value = accessory.size || "";
        document.getElementById("stock").value = accessory.stock || 0;
        document.getElementById("imageUrl").value = accessory.imageUrl || "";
        document.getElementById("description").value = accessory.description || "";

    } catch (err) {
        console.error("Lỗi load phụ kiện:", err);
        showToast("⚠ Lỗi khi tải dữ liệu phụ kiện", "error");
    }
}


/* ---------------------------
       SUBMIT UPDATE
----------------------------*/
async function submitForm(e, id) {
    e.preventDefault();
    console.log("SUBMIT UPDATE", id);

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

    // ==== VALIDATE ====
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
    if (payload.stock < 0) {
        showToast("❌ Tồn kho không hợp lệ", "error");
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json();
            showToast("❌ " + (err.errorMessage || "Lỗi khi cập nhật"), "error");
            return;
        }

        const data = await res.json();
        console.log("UPDATED:", data);

        showToast("✔ Cập nhật phụ kiện thành công!", "success");

        setTimeout(() => {
            window.location.href = "accessories-admin.html";
        }, 900);

    } catch (error) {
        console.error(error);
        showToast("⚠ Không thể kết nối server!", "error");
    }
}
