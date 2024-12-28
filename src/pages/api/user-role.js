import supabase from '../../utils/supabaseClient';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.query;

    const { data: user, error } = await supabase
        .from('users')
        .select('role, company_id')
        .eq('email', email)
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (user.company_id) {
        return res.status(200).json({ status: 'worker', role: user.role, company_id: user.company_id });
    }

    return res.status(200).json({ status: 'unallocated' });
}
