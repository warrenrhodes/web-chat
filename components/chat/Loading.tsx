import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const LoadingFallback = () => {
  const shimmer = {
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "linear",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white p-4 border-b">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={`left-${i}`}
              variants={itemVariants}
              className="max-w-[70%]"
            >
              <Card className="bg-white">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <motion.div
                    variants={shimmer}
                    animate="animate"
                    className="space-y-1"
                  >
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[80%]" />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {[1, 2].map((i) => (
            <motion.div
              key={`right-${i}`}
              variants={itemVariants}
              className="max-w-[70%] ml-auto"
            >
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-end space-x-2">
                    <Skeleton className="h-3 w-24 bg-primary-foreground/20" />
                    <Skeleton className="h-6 w-6 rounded-full bg-primary-foreground/20" />
                  </div>
                  <motion.div
                    variants={shimmer}
                    animate="animate"
                    className="space-y-1"
                  >
                    <Skeleton className="h-4 w-full bg-primary-foreground/20" />
                    <Skeleton className="h-4 w-[60%] bg-primary-foreground/20" />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default LoadingFallback;
