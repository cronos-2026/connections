// Cloudflare Worker：只轉送 OCR.Space 請求，不保存名片或圖片。
// 部署後以 `wrangler secret put OCR_SPACE_API_KEY` 設定金鑰。
export default {
  async fetch(request, env) {
    const cors = {"Access-Control-Allow-Origin":"https://您的帳號.github.io","Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"content-type"};
    if (request.method === "OPTIONS") return new Response(null, {headers:cors});
    if (request.method !== "POST") return json({error:"只接受 POST"},405,cors);
    try {
      const {image} = await request.json();
      if (!image || image.length > 15_000_000) return json({error:"請提供 15MB 以下的名片圖片"},400,cors);
      const form = new FormData();
      form.set("base64Image", `data:image/jpeg;base64,${image}`);
      form.set("language", "cht");
      form.set("isOverlayRequired", "true");
      form.set("detectOrientation", "true");
      form.set("scale", "true");
      const response = await fetch("https://api.ocr.space/parse/image", {method:"POST",headers:{apikey:env.OCR_SPACE_API_KEY},body:form});
      const result = await response.json();
      if (!response.ok || result.IsErroredOnProcessing) throw new Error(result.ErrorMessage?.join("；") || "OCR.Space 無法辨識這張名片");
      return json({text:result.ParsedResults?.map(x=>x.ParsedText).join("\n") || "", raw:result},200,cors);
    } catch (error) { return json({error:error.message || "辨識服務暫時無法使用"},500,cors); }
  }
};
function json(data,status,headers){return new Response(JSON.stringify(data),{status,headers:{...headers,"content-type":"application/json; charset=utf-8"}})}
