document.addEventListener("DOMContentLoaded", () => {
    
    const btn_login = document.getElementById("btn_login");
    btn_login.addEventListener("click", async (e) => {
        e.preventDefault();
        const user_email = document.getElementById("u_email").value;
        const user_pass = document.getElementById("u_pass").value;

        const d_obj = {
            email:user_email, password: user_pass
        };

        const send_reg = await fetch("http://127.0.0.1:4000/login", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(d_obj)
        });
        
        const r_dat = await send_reg.json();
        alert(r_dat.resp);

    });
});