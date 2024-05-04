
document.addEventListener("DOMContentLoaded", () => {
  
   const btn_delete = document.querySelector(".delete_btn");
   const btn_get_link = document.querySelector(".get-url");
   const btn_list = document.querySelector(".list_btn");
   const btn_put = document.querySelector('.btn_put');
   const vid_tag = document.getElementById("vid_frame");

   btn_put.addEventListener("click", async (e) => {
      e.preventDefault();
      const d_file = document.getElementById("d_file");
      const file_desc = document.querySelector(".file_description");
      if(d_file.files.length > 0){
        console.log(d_file.files[0].type);
         const mfile = {file_name: d_file.files[0].name, file_mime: d_file.files[0].type, file_description: file_desc.value, file_size: d_file.files[0].size, file_category: ''};
         const rec_put_link = await fetch("/upload",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: 'include',
            body: JSON.stringify(mfile)
         });
         if(rec_put_link.status === 200){
            const final_url = await rec_put_link.json();
            const put_req = await fetch(final_url.resp, {
                method: "PUT",
                headers: {
                    "Content-Type": d_file.files[0].type
                },
                body: d_file.files[0]
            });
            
            if(put_req.status === 200){
                alert("Hey the file was uploaded");
            }
            else{
                alert("Something went wrong");
            }
         }
         else{
            const j_resp = await rec_put_link.json();
            alert(j_resp.resp);
         }
      }
      else{
        alert("File and the description is required");
      }
   });

});