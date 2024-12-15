import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Building2, MapPin, Users } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validateRequired } from '../utils/validation';
import { createCompany, updateProfile, createBranch } from '../services/api';
import toast from 'react-hot-toast';

// ... rest of the file remains the same