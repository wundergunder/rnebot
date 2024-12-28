import { Request, Response, NextFunction } from 'express';
import { supabase } from '../../../lib/supabase';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Attach user to request
    req.user = session.user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}