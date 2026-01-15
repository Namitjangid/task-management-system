import {Router,Response} from 'express';
import {supabase} from '../supabaseClient';
import {requireAuth,AuthRequest} from '../middleware/auth';
const router = Router();
router.get('/',requireAuth,async(req:AuthRequest,res:Response) => {
  const userId=req.user!.id;
  const {data,error} = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id',userId)
    .order('created_at',{ascending:false});
  if (error) {
    return res.status(500).json({error:error.message});
  }
  res.json(data);
});
router.post('/',requireAuth,async(req:AuthRequest,res:Response) => {
  const userId = req.user!.id;
  const {title,description} = req.body;
  
  if (!title||title.trim().length===0) {
    return res.status(400).json({error:'Title is required'});
  }
  if (title.length>100) {
    return res.status(400).json({error:'Title too long'});
  }
  const {data,error} = await supabase
    .from('tasks')
    .insert([
      {
        title:title.trim(),
        description:description?.trim() || '',
        status:'Pending',
        user_id:userId,
      },
    ])
    .select()
    .single();
  if (error) {
    return res.status(500).json({error:error.message});
  }
  res.status(201).json(data);
});
router.put('/:id',requireAuth,async(req:AuthRequest,res:Response) => {
  const {id} = req.params;
  const {title,description,status} = req.body;
 
  if (status && !['Pending','Completed'].includes(status)) {
    return res.status(400).json({error:'Invalid status value'});
  }
  if (title !== undefined && title.trim().length === 0) {
    return res.status(400).json({ error:'Title cannot be empty'});
  }
  const updates: Record<string, any> = {};
  if (title !==undefined) updates.title=title.trim();
  if (description !==undefined) updates.description=description.trim();
  if (status !==undefined) updates.status =status;
  if (Object.keys(updates).length===0) {
    return res.status(400).json({error:'No valid fields to update'});
  }
  const {error} = await supabase
    .from('tasks')
    .update(updates)
    .eq('id',id);
  if (error) {
    return res.status(500).json({error:error.message});
  }
  res.json({success:true});
});
router.delete('/:id',requireAuth,async(req:AuthRequest,res:Response) => {
  const {id} = req.params;
  const {error} = await supabase
    .from('tasks')
    .delete()
    .eq('id',id);
  if (error) {
    return res.status(500).json({error:error.message});
  }
  res.json({success:true});
});
export default router;
