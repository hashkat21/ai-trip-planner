-- Add search history table to store user's trip planning history
CREATE TABLE IF NOT EXISTS trip_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  destination TEXT NOT NULL,
  duration TEXT NOT NULL,
  budget TEXT NOT NULL,
  travelers TEXT NOT NULL,
  interests TEXT[] DEFAULT '{}',
  accommodation TEXT,
  transportation TEXT,
  additional_requests TEXT,
  itinerary_content TEXT NOT NULL,
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  trip_title TEXT,
  estimated_cost TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_trip_history_user_id ON trip_history(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_history_created_at ON trip_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trip_history_destination ON trip_history(destination);

-- Enable Row Level Security
ALTER TABLE trip_history ENABLE ROW LEVEL SECURITY;

-- Create policies for trip_history
CREATE POLICY "Users can view own trip history" ON trip_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trip history" ON trip_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trip history" ON trip_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trip history" ON trip_history
  FOR DELETE USING (auth.uid() = user_id);

-- Update existing itineraries table if needed (optional migration)
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS trip_title TEXT;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS estimated_cost TEXT;
