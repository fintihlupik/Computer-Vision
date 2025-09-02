from fastapi import APIRouter, HTTPException
from backend.database.supabase_client import supabase_client
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/detections")
async def get_all_detections():
    """Get all detections with frame capture information"""
    try:
        response = supabase_client.client.table('detections')\
            .select('''
                *,
                brands!inner(name),
                frame_captures(public_url, path, frame_number)
            ''')\
            .order('created_at', desc=True)\
            .execute()
        
        # Transform the response to include brand names and frame URLs
        detections = []
        for detection in response.data:
            detection_data = {
                'id': detection['id'],
                'file_id': detection['file_id'],
                'brand_name': detection['brands']['name'] if detection['brands'] else None,
                'score': detection['score'],
                'bbox': detection['bbox'],
                't_start': detection['t_start'],
                't_end': detection['t_end'],
                'frame': detection['frame'],
                'model': detection['model'],
                'created_at': detection['created_at'],
                'frame_capture_url': detection['frame_captures']['public_url'] if detection['frame_captures'] else None,
                'frame_capture_path': detection['frame_captures']['path'] if detection['frame_captures'] else None,
                'frame_number': detection['frame_captures']['frame_number'] if detection['frame_captures'] else None
            }
            detections.append(detection_data)
        
        return {"detections": detections}
    except Exception as e:
        logger.error(f"Error getting all detections: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/detections/{file_id}")
async def get_detections(file_id: int):
    """Get all detections for a file with frame capture information"""
    try:
        response = supabase_client.client.table('detections')\
            .select('''
                *,
                brands!inner(name),
                frame_captures(public_url, path, frame_number)
            ''')\
            .eq('file_id', file_id)\
            .execute()
        
        # Transform the response to include brand names and frame URLs
        detections = []
        for detection in response.data:
            detection_data = {
                'id': detection['id'],
                'file_id': detection['file_id'],
                'brand_name': detection['brands']['name'] if detection['brands'] else None,
                'score': detection['score'],
                'bbox': detection['bbox'],
                't_start': detection['t_start'],
                't_end': detection['t_end'],
                'frame': detection['frame'],
                'model': detection['model'],
                'created_at': detection['created_at'],
                'frame_capture_url': detection['frame_captures']['public_url'] if detection['frame_captures'] else None,
                'frame_capture_path': detection['frame_captures']['path'] if detection['frame_captures'] else None,
                'frame_number': detection['frame_captures']['frame_number'] if detection['frame_captures'] else None
            }
            detections.append(detection_data)
        
        return {"detections": detections}
    except Exception as e:
        logger.error(f"Error getting detections: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/predictions/{file_id}")
async def get_predictions(file_id: int):
    """Get all predictions for a file"""
    try:
        response = supabase_client.client.table('predictions')\
            .select('*, brands!inner(name)')\
            .eq('video_id', file_id)\
            .execute()
        
        return {"predictions": response.data}
    except Exception as e:
        logger.error(f"Error getting predictions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/files")
async def get_files():
    """Get all processed files"""
    try:
        response = supabase_client.client.table('files')\
            .select('*')\
            .order('created_at', desc=True)\
            .execute()
        
        return {"files": response.data}
    except Exception as e:
        logger.error(f"Error getting files: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/frame-captures/{file_id}")
async def get_frame_captures(file_id: int):
    """Get all frame captures for a file"""
    try:
        response = supabase_client.client.table('frame_captures')\
            .select('*')\
            .eq('file_id', file_id)\
            .order('frame_number')\
            .execute()
        
        return {"frame_captures": response.data}
    except Exception as e:
        logger.error(f"Error getting frame captures: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/frame-captures")
async def get_all_frame_captures():
    """Get all frame captures"""
    try:
        response = supabase_client.client.table('frame_captures')\
            .select('*')\
            .order('created_at', desc=True)\
            .execute()
        
        return {"frame_captures": response.data}
    except Exception as e:
        logger.error(f"Error getting all frame captures: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_dashboard_stats():
    """Get overall dashboard statistics"""
    try:
        # Get total files count
        files_response = supabase_client.client.table('files')\
            .select('id', count='exact')\
            .execute()
        total_files = files_response.count or 0
        
        # Get total detections count
        detections_response = supabase_client.client.table('detections')\
            .select('id', count='exact')\
            .execute()
        total_detections = detections_response.count or 0
        
        # Get unique brands count
        brands_response = supabase_client.client.table('brands')\
            .select('id', count='exact')\
            .execute()
        total_brands = brands_response.count or 0
        
        # Get recent uploads (last 7 days)
        from datetime import datetime, timedelta
        seven_days_ago = (datetime.now() - timedelta(days=7)).isoformat()
        recent_files_response = supabase_client.client.table('files')\
            .select('id', count='exact')\
            .gte('created_at', seven_days_ago)\
            .execute()
        recent_uploads = recent_files_response.count or 0
        
        return {
            "total_files": total_files,
            "total_detections": total_detections,
            "total_brands": total_brands,
            "recent_uploads": recent_uploads
        }
    except Exception as e:
        logger.error(f"Error getting dashboard stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/brand-stats")
async def get_brand_stats():
    """Get brand statistics for dashboard"""
    try:
        # Get brands with their detection counts and average confidence
        # Join detections with brands to get brand names
        response = supabase_client.client.table('detections')\
            .select('''
                score,
                brands!inner(name)
            ''')\
            .execute()
        
        # Process the data to calculate statistics per brand
        brand_stats = {}
        for detection in response.data:
            if detection['brands'] and detection['brands']['name']:
                brand_name = detection['brands']['name']
                score = detection['score']
                
                if brand_name not in brand_stats:
                    brand_stats[brand_name] = {
                        'detection_count': 0,
                        'total_confidence': 0.0
                    }
                
                brand_stats[brand_name]['detection_count'] += 1
                brand_stats[brand_name]['total_confidence'] += float(score)
        
        # Calculate averages and format response
        brands = []
        for brand_name, stats in brand_stats.items():
            brands.append({
                'brand_name': brand_name,
                'detection_count': stats['detection_count'],
                'confidence_avg': stats['total_confidence'] / stats['detection_count']
            })
        
        # Sort by detection count (descending)
        brands.sort(key=lambda x: x['detection_count'], reverse=True)
        
        return {"brands": brands}
    except Exception as e:
        logger.error(f"Error getting brand stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))
