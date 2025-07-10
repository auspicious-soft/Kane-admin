"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import TextEditor from "@/components/policies/txtEditor";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createPolicies, GetPolicies } from "@/services/admin-services";
import { POLICIES_URL } from "@/constants/apiUrls";
import toast from "react-hot-toast";
import { useLoading } from "@/context/loading-context";

const Page = () => {
  const [editorContents, setEditorContents] = useState({
    helpAndSupport: "",
    termsAndConditions: "",
    privacyPolicy: "",
  });
  const [policyExists, setPolicyExists] = useState({
    helpAndSupport: false,
    termsAndConditions: false,
    privacyPolicy: false,
  });
  const [unsavedChanges, setUnsavedChanges] = useState({
    helpAndSupport: false,
    termsAndConditions: false,
    privacyPolicy: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("help&support");
  const {startLoading, stopLoading} = useLoading()

  const fetchPolicyData = async (type: string) => {
    const stateKey =
      type === "support"
        ? "helpAndSupport"
        : type === "terms"
        ? "termsAndConditions"
        : "privacyPolicy";

    if (unsavedChanges[stateKey]) {
      return;
    }

    try {
      setError(null);
      setLoading(true);
      startLoading()
      const response = await GetPolicies(POLICIES_URL.GET_POLCIIES(type));
      if (response.status === 200) {
        const policyData = response.data.data;
        setEditorContents((prev) => ({
          ...prev,
          [stateKey]: policyData || "",
        }));
        setPolicyExists((prev) => ({
          ...prev,
          [stateKey]: true,
        }));
        // toast.success(
        //   response.data.message || `Fetched ${type} policy successfully`
        // );
      } else if (response.status === 404) {
        setEditorContents((prev) => ({
          ...prev,
          [stateKey]: "", 
        }));
        setPolicyExists((prev) => ({
          ...prev,
          [stateKey]: false, 
        }));
        toast(`No ${type} policy found. You can create a new one.`);
      } else {
        toast(response.data.message || `Failed to fetch ${type} policy`);
      }
    } catch (error: any) {
      console.error(`Error fetching ${type} policy:`, error);
      if (error.response?.status === 404) {
        setEditorContents((prev) => ({
          ...prev,
          [stateKey]: "",
        }));
        setPolicyExists((prev) => ({
          ...prev,
          [stateKey]: false,
        }));
        toast.error(`No ${type} policy found. You can create a new one.`);
      } else {
        setError(`Failed to fetch ${type} policy. Please try again.`);
        toast.error(`Failed to fetch ${type} policy.`);
      }
    } finally {
      setLoading(false);
      stopLoading()
    }
  };

  useEffect(() => {
    fetchPolicyData("support");
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const type =
      value === "help&support"
        ? "support"
        : value === "terms&condition"
        ? "terms"
        : "privacyPolicy";
    fetchPolicyData(type);
  };

  const handleContentChange = (tab: string, content: string) => {
    setEditorContents((prev) => ({
      ...prev,
      [tab]: content,
    }));
    setUnsavedChanges((prev) => ({
      ...prev,
      [tab]: true,
    }));
  };

  const handleSubmit = async () => {
    if (
      !editorContents.helpAndSupport ||
      !editorContents.termsAndConditions ||
      !editorContents.privacyPolicy
    ) {
      toast.error("All policy fields are required.");
      return;
    }

    setLoading(true);
    startLoading();
    try {
      setError(null);
      const formattedData = {
        termsAndConditions: editorContents.termsAndConditions,
        helpAndSupport: editorContents.helpAndSupport,
        privacyPolicy: editorContents.privacyPolicy,
      };
      const response = await createPolicies(
        POLICIES_URL.CREATE_POLICIES,
        formattedData
      );
      if (response.status === 201 || response.status === 200) {
        toast.success(
          response.data.message ||
            (policyExists.helpAndSupport ||
            policyExists.termsAndConditions ||
            policyExists.privacyPolicy
              ? "Policies updated successfully"
              : "Policies created successfully")
        );
        setPolicyExists({
          helpAndSupport: true,
          termsAndConditions: true,
          privacyPolicy: true,
        });
        setUnsavedChanges({
          helpAndSupport: false,
          termsAndConditions: false,
          privacyPolicy: false,
        });
        fetchPolicyData(
          activeTab === "help&support"
            ? "support"
            : activeTab === "terms&condition"
            ? "terms"
            : "privacyPolicy"
        );
      } else {
        toast.error(response.data.message || "Failed to save policies");
      }
    } catch (error) {
      console.error("Error saving policies:", error);
      setError("Failed to save policies. Please try again.");
      toast.error("Failed to save policies.");
    } finally {
      setLoading(false);
      stopLoading()
    }
  };

  return (
    <>
      <Tabs
        defaultValue="help&support"
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="help&support">Help & Support</TabsTrigger>
          <TabsTrigger value="terms&condition">Terms & Conditions</TabsTrigger>
          <TabsTrigger value="privacypolicy">Privacy Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="help&support">
          <div className="border border-[#2F2F2F] rounded-md py-3 px-4 md:py-[18px] md:px-7 transition-[width,height] ease-linear">
            <h2 className="text-lg font-semibold mb-2">Text Editor</h2>
            <TextEditor
              value={editorContents.helpAndSupport}
              setDescription={(content) =>
                handleContentChange("helpAndSupport", content)
              }
            />
          </div>
        </TabsContent>
        <TabsContent value="terms&condition">
          <div className="border border-[#2F2F2F] rounded-md py-3 px-4 md:py-[18px] md:px-7 transition-[width,height] ease-linear">
            <h2 className="text-lg font-semibold mb-2">Text Editor</h2>
            <TextEditor
              value={editorContents.termsAndConditions}
              setDescription={(content) =>
                handleContentChange("termsAndConditions", content)
              }
            />
          </div>
        </TabsContent>
        <TabsContent value="privacypolicy">
          <div className="border border-[#2F2F2F] rounded-md py-3 px-4 md:py-[18px] md:px-7 transition-[width,height] ease-linear">
            <h2 className="text-lg font-semibold mb-2">Text Editor</h2>
            <TextEditor
              value={editorContents.privacyPolicy}
              setDescription={(content) =>
                handleContentChange("privacyPolicy", content)
              }
            />
          </div>
        </TabsContent>
      </Tabs>

      <Button
        className="max-w-max px-[30px] py-2.5 bg-[#e4bc84] rounded inline-flex justify-center items-center gap-2 text-[#0a0e11] text-sm font-normal"
        type="button"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading
          ? "Saving..."
          : policyExists.helpAndSupport ||
            policyExists.termsAndConditions ||
            policyExists.privacyPolicy
          ? "Update"
          : "Save"}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
};

export default Page;