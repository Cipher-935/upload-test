document.addEventListener("DOMContentLoaded", () => {

    const btn_register = document.getElementById("btn_register");
    btn_register.addEventListener("click", async (e) => {
        e.preventDefault();
        const username = document.getElementById("u_input").value;
        const user_email = document.getElementById("u_email").value;
        const user_pass = document.getElementById("u_pass").value;

        const d_obj = {
            name: username, email:user_email, password: user_pass
        };

        const send_reg = await fetch("/signup", {
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