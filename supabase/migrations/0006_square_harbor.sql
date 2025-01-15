/*
  # Add Analytics and Role Selection

  1. New Tables
    - `analytics_events`: Stores user engagement events
    - Add role fields to profiles table
  
  2. Changes
    - Add role-specific fields to profiles
    - Add analytics tracking capabilities
    
  3. Security
    - Enable RLS on analytics_events
    - Add policies for event tracking
*/

-- Add role fields to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS user_role text,
ADD COLUMN IF NOT EXISTS role_details jsonb DEFAULT '{}'::jsonb;

-- Create analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  
  -- Add indices for common queries
  CONSTRAINT valid_event_type CHECK (event_type IN (
    'profile_view',
    'connection_request',
    'post_interaction',
    'project_interaction',
    'session_start',
    'session_end',
    'feature_usage'
  ))
);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own events"
  ON analytics_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own events"
  ON analytics_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indices
CREATE INDEX IF NOT EXISTS analytics_user_id_idx ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS analytics_event_type_idx ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS analytics_created_at_idx ON analytics_events(created_at);