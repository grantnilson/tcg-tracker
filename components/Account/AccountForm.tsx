import { useState, useEffect, useCallback } from "react";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";

import { Database } from "../../utils/database.types";
import Avatar from "../Avatar/Avatar";

type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function AccountForm() {
  const supabase = createClientComponentClient<Database>();
  const user = useUser();

  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  const [username, setUsername] = useState<Profiles["username"]>("");
  const [avatar_url, setAvatarUrl] = useState<Profiles["avatar_url"]>("");

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      if (!user) throw new Error("No user");
      //console.log(" Account form user :", user);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
      setPageLoading(true);
    } catch (error) {
      alert("Error loading user data in AccountForm!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (user) {
      getProfile(); // Call getProfile only if there is a user
    }
  }, [user, getProfile]);

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: Profiles["username"];
    avatar_url: Profiles["avatar_url"];
  }) {
    try {
      setLoading(true);
      if (!user) throw new Error("No user");

      const updates = {
        id: user.id,
        username,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (!pageLoading) {
    // Render a loading state until the profile data is loaded
    return <div>Loading...</div>;
  }

  return (
    <div className="form-widget">
      <div>
        {user && (
          <Avatar
            uid={user.id}
            url={avatar_url}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url);
              updateProfile({ username, avatar_url: url });
            }}
          />
        )}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={user?.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ username, avatar_url })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <button
          className="button block"
          onClick={() =>
            supabase.auth.signOut().then(() => window.location.reload())
          }
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
