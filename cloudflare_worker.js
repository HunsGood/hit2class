// Cloudflare Worker - D1 데이터베이스 API
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS 헤더 설정
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // OPTIONS 요청 처리 (CORS preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // GET: 모든 캐릭터 조회
      if (path === '/api/characters' && request.method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT * FROM characters ORDER BY id'
        ).all();
        
        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // POST: 새 캐릭터 추가
      if (path === '/api/characters' && request.method === 'POST') {
        const body = await request.json();
        const { name, lv, skill } = body;
        
        const result = await env.DB.prepare(
          'INSERT INTO characters (name, lv, skill) VALUES (?, ?, ?)'
        ).bind(name, lv, skill).run();
        
        return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // PUT: 캐릭터 수정
      if (path.startsWith('/api/characters/') && request.method === 'PUT') {
        const id = path.split('/')[3];
        const body = await request.json();
        const { name, lv, skill } = body;
        
        await env.DB.prepare(
          'UPDATE characters SET name = ?, lv = ?, skill = ? WHERE id = ?'
        ).bind(name, lv, skill, id).run();
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // DELETE: 캐릭터 삭제
      if (path.startsWith('/api/characters/') && request.method === 'DELETE') {
        const id = path.split('/')[3];
        
        await env.DB.prepare(
          'DELETE FROM characters WHERE id = ?'
        ).bind(id).run();
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders 
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};